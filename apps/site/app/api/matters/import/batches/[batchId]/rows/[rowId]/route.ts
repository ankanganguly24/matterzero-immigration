import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { authorizeMatterWorkspace, isSameOrigin } from "@/lib/dashboard/matter-access";
import { getDb } from "@/lib/db";
import { importBatchRows, importBatches } from "@/lib/db/schema";

function respond(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string; rowId: string }> },
) {
  if (!isSameOrigin(request)) return respond(403, "Request origin was rejected.");
  const workspaceId = request.nextUrl.searchParams.get("workspace_id") ?? "";
  const access = await authorizeMatterWorkspace(workspaceId, "write");
  if (!access.ok) return respond(access.status, access.error);
  const { batchId, rowId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond(400, "Choose whether to create or skip the duplicate row.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return respond(400, "Choose whether to create or skip the duplicate row.");
  }
  const action = (body as Record<string, unknown>).action;
  if (action !== "create" && action !== "skip") return respond(400, "Choose create or skip.");

  try {
    const db = getDb();
    const updated = await db.transaction(async (transaction) => {
      const [batch] = await transaction
        .select({
          id: importBatches.id,
          status: importBatches.status,
          expiresAt: importBatches.expiresAt,
        })
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
      if (!batch || batch.status !== "pending" || batch.expiresAt <= new Date())
        return "unavailable";

      const [row] = await transaction
        .select({
          id: importBatchRows.id,
          isDuplicate: importBatchRows.isDuplicate,
          errors: importBatchRows.errors,
        })
        .from(importBatchRows)
        .where(and(eq(importBatchRows.id, rowId), eq(importBatchRows.batchId, batchId)))
        .limit(1);
      if (!row) return "unavailable";
      if (!row.isDuplicate || row.errors.length) return "not-duplicate";
      await transaction
        .update(importBatchRows)
        .set({ action })
        .where(eq(importBatchRows.id, rowId));
      return "updated";
    });
    if (updated === "unavailable")
      return respond(404, "This import row is unavailable or has expired.");
    if (updated === "not-duplicate")
      return respond(400, "Only valid duplicate rows can be changed.");
    return NextResponse.json(
      { row_id: rowId, action },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return respond(503, "The import row could not be updated. Refresh the preview and retry.");
  }
}
