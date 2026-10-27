import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { demoMatterApprovals } from "@/lib/db/schema";
import { DEMO_MATTER_ID, getDemoMatterExport, getDemoMatterVersionHash } from "@/lib/demo/matter";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authorization = await requireAdmin(request);
  if (authorization.error) return authorization.error;

  if (request.nextUrl.searchParams.get("matterId") !== DEMO_MATTER_ID) {
    return NextResponse.json({ error: "Matter not found." }, { status: 404 });
  }

  try {
    const db = getDb();
    const [approval] = await db
      .select({ id: demoMatterApprovals.id })
      .from(demoMatterApprovals)
      .where(
        and(
          eq(demoMatterApprovals.matterId, DEMO_MATTER_ID),
          eq(demoMatterApprovals.versionHash, getDemoMatterVersionHash()),
        ),
      )
      .limit(1);

    if (!approval) {
      return NextResponse.json(
        { error: "Reviewer approval is required before this version can be exported." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { downloadName: "matterzero-demo-review.json", payload: getDemoMatterExport() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Export verification is unavailable. Check the database migration and server connection.",
      },
      { status: 503 },
    );
  }
}
