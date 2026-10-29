import { eq, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { authorizeMatterWorkspace, isSameOrigin } from "@/lib/dashboard/matter-access";
import { getDb } from "@/lib/db";
import { importBatchRows, importBatches, matters } from "@/lib/db/schema";
import { duplicateKey, matterCsvHeaders, parseCsv } from "@/lib/matters/csv";
import { matterRowSchema, type MatterRow } from "@/lib/matters/validation";

const maxFileBytes = 5 * 1024 * 1024;
const maxRows = 500;
const expiryMs = 15 * 60 * 1000;

function respond(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function rowObject(headers: string[], values: string[]): Record<string, string> {
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return respond(403, "Request origin was rejected.");
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxFileBytes + 64 * 1024)
    return respond(413, "CSV files must be 5 MB or smaller.");

  const workspaceId = request.nextUrl.searchParams.get("workspace_id") ?? "";
  const access = await authorizeMatterWorkspace(workspaceId, "write");
  if (!access.ok) return respond(access.status, access.error);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(400, "Choose a CSV file to preview.");
  }
  const file = form.get("file");
  if (!(file instanceof File)) return respond(400, "Choose a CSV file to preview.");
  if (file.size === 0) return respond(400, "The CSV file is empty.");
  if (file.size > maxFileBytes) return respond(413, "CSV files must be 5 MB or smaller.");
  if (!file.name.toLowerCase().endsWith(".csv")) return respond(400, "Choose a .csv file.");

  let grid: string[][];
  try {
    grid = parseCsv(await file.text());
  } catch (error) {
    return respond(400, error instanceof Error ? error.message : "The CSV file could not be read.");
  }
  if (grid.length < 2) return respond(400, "Add a header row and at least one applicant row.");
  if (grid.length - 1 > maxRows)
    return respond(413, "A batch can contain no more than 500 applicant rows.");

  const headers = grid[0].map((value) => value.trim().toLowerCase());
  if (
    headers.length !== matterCsvHeaders.length ||
    new Set(headers).size !== matterCsvHeaders.length ||
    matterCsvHeaders.some((header) => !headers.includes(header))
  ) {
    return respond(400, `Use these CSV columns: ${matterCsvHeaders.join(", ")}.`);
  }

  let existing: { email: string; petitionType: string; sponsorEmployer: string }[];
  try {
    existing = await getDb()
      .select({
        email: matters.email,
        petitionType: matters.petitionType,
        sponsorEmployer: matters.sponsorEmployer,
      })
      .from(matters)
      .where(eq(matters.workspaceId, workspaceId));
  } catch {
    return respond(503, "Matters are unavailable. Apply the latest database migration and retry.");
  }
  const knownKeys = new Set(
    existing.map((matter) =>
      duplicateKey({
        email: matter.email,
        petition_type: matter.petitionType,
        sponsor_employer: matter.sponsorEmployer,
      }),
    ),
  );
  const seenKeys = new Set<string>();
  const stagedRows: Omit<typeof importBatchRows.$inferInsert, "batchId">[] = [];
  const previewRows: {
    row_number: number;
    data: Record<string, string>;
    errors: string[];
    is_duplicate: boolean;
    action: "create" | "skip" | "invalid";
  }[] = [];

  for (let index = 1; index < grid.length; index += 1) {
    const values = grid[index];
    const rawData = rowObject(headers, values);
    const rowErrors: string[] = [];
    if (values.length !== matterCsvHeaders.length) rowErrors.push("Expected exactly six columns.");
    const parsed = matterRowSchema.safeParse(rawData);
    if (!parsed.success) rowErrors.push(...parsed.error.issues.map((issue) => issue.message));

    const normalized: MatterRow | null = parsed.success ? parsed.data : null;
    const key = normalized ? duplicateKey(normalized) : null;
    const isDuplicate = key ? knownKeys.has(key) || seenKeys.has(key) : false;
    if (key) seenKeys.add(key);
    const action = rowErrors.length ? "invalid" : isDuplicate ? "skip" : "create";
    const rowNumber = index + 1;
    previewRows.push({
      row_number: rowNumber,
      data: rawData,
      errors: rowErrors,
      is_duplicate: isDuplicate,
      action,
    });
    stagedRows.push({ rowNumber, rawData, errors: rowErrors, isDuplicate, action });
  }

  const db = getDb();
  try {
    const batchId = await db.transaction(async (transaction) => {
      await transaction.delete(importBatches).where(lt(importBatches.expiresAt, new Date()));
      const [batch] = await transaction
        .insert(importBatches)
        .values({
          workspaceId,
          createdBy: access.userId,
          status: "pending",
          totalRows: stagedRows.length,
          expiresAt: new Date(Date.now() + expiryMs),
        })
        .returning({ id: importBatches.id });
      const savedRows = await transaction
        .insert(importBatchRows)
        .values(stagedRows.map((row) => ({ ...row, batchId: batch.id })))
        .returning({ id: importBatchRows.id, rowNumber: importBatchRows.rowNumber });
      return { id: batch.id, idByRow: new Map(savedRows.map((row) => [row.rowNumber, row.id])) };
    });

    const rows = previewRows.map((row) => ({
      ...row,
      row_id: batchId.idByRow.get(row.row_number),
    }));
    const invalidCount = rows.filter((row) => row.action === "invalid").length;
    const duplicateCount = rows.filter((row) => row.is_duplicate).length;
    return NextResponse.json(
      {
        batch_id: batchId.id,
        expires_in_seconds: 900,
        total_rows: rows.length,
        valid_count: rows.length - invalidCount,
        duplicate_count: duplicateCount,
        invalid_count: invalidCount,
        rows,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return respond(
      503,
      "The import preview could not be staged. Check the matter migration and retry.",
    );
  }
}
