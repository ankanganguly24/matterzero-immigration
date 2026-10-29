import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { authorizeMatterWorkspace, isSameOrigin } from "@/lib/dashboard/matter-access";
import { getDb } from "@/lib/db";
import { importBatchRows, importBatches, matters } from "@/lib/db/schema";
import { duplicateKey } from "@/lib/matters/csv";
import { matterRowSchema } from "@/lib/matters/validation";

function respond(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return respond(403, "Request origin was rejected.");
  const workspaceId = request.nextUrl.searchParams.get("workspace_id") ?? "";
  const access = await authorizeMatterWorkspace(workspaceId, "write");
  if (!access.ok) return respond(access.status, access.error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond(400, "The import batch could not be confirmed.");
  }
  const batchId =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>).batch_id
      : undefined;
  if (typeof batchId !== "string" || !/^[0-9a-f-]{36}$/i.test(batchId)) {
    return respond(400, "The import batch could not be confirmed.");
  }

  try {
    const result = await getDb().transaction(async (transaction) => {
      const [batch] = await transaction
        .select()
        .from(importBatches)
        .where(
          and(
            eq(importBatches.id, batchId),
            eq(importBatches.workspaceId, workspaceId),
            eq(importBatches.createdBy, access.userId),
          ),
        )
        .for("update")
        .limit(1);
      if (!batch) throw new Error("batch-not-found");
      if (batch.status === "completed" && batch.result) return batch.result;
      if (batch.expiresAt <= new Date()) throw new Error("batch-expired");
      if (batch.status !== "pending") throw new Error("batch-invalid");

      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${workspaceId}, 0))`,
      );

      const rows = await transaction
        .select()
        .from(importBatchRows)
        .where(eq(importBatchRows.batchId, batch.id))
        .orderBy(importBatchRows.rowNumber);
      const rowsToCreate = rows.filter((row) => row.action === "create");
      const parsedRows = rowsToCreate.map((row) => {
        const parsed = matterRowSchema.safeParse(row.rawData);
        if (!parsed.success || row.errors.length) throw new Error("batch-invalid-row");
        return { row, data: parsed.data };
      });

      const existing = await transaction
        .select({
          email: matters.email,
          petitionType: matters.petitionType,
          sponsorEmployer: matters.sponsorEmployer,
        })
        .from(matters)
        .where(eq(matters.workspaceId, workspaceId));
      const existingKeys = new Set(
        existing.map((matter) =>
          duplicateKey({
            email: matter.email,
            petition_type: matter.petitionType,
            sponsor_employer: matter.sponsorEmployer,
          }),
        ),
      );
      for (const { row, data } of parsedRows) {
        if (!row.isDuplicate && existingKeys.has(duplicateKey(data))) {
          throw new Error("batch-stale-duplicate");
        }
      }

      const inserted = parsedRows.length
        ? await transaction
            .insert(matters)
            .values(
              parsedRows.map(({ row, data }) => ({
                workspaceId,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                petitionType: data.petition_type,
                sponsorEmployer: data.sponsor_employer,
                fieldOfEndeavor: data.field_of_endeavor,
                status: "intake" as const,
                createdBy: access.userId,
                importBatchRowId: row.id,
              })),
            )
            .returning({ id: matters.id })
        : [];
      const completedResult = {
        count: inserted.length,
        matterIds: inserted.map((matter) => matter.id),
      };

      await transaction
        .update(importBatches)
        .set({ status: "completed", result: completedResult, completedAt: new Date() })
        .where(eq(importBatches.id, batch.id));
      await transaction.delete(importBatchRows).where(eq(importBatchRows.batchId, batch.id));
      return completedResult;
    });

    return NextResponse.json(
      {
        success_count: result.count,
        matter_ids: result.matterIds,
        message: `Successfully provisioned ${result.count} new matter ${result.count === 1 ? "workspace" : "workspaces"}.`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (reason === "batch-not-found") return respond(404, "Import batch not found.");
    if (reason === "batch-expired")
      return respond(410, "This import preview expired. Upload the CSV again.");
    if (reason === "batch-stale-duplicate") {
      return respond(
        409,
        "A matching matter was created after this preview. Recheck duplicates and confirm again.",
      );
    }
    if (reason === "batch-invalid" || reason === "batch-invalid-row") {
      return respond(
        409,
        "This import batch changed or contains invalid rows. Preview the CSV again.",
      );
    }
    return respond(503, "The import could not be confirmed. Check the matter migration and retry.");
  }
}
