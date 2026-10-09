import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { pilotRequests } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const authorization = await requireAdmin(request);
  if (authorization.error) return authorization.error;
  try {
    const data = await getDb()
      .select({
        id: pilotRequests.id,
        email: pilotRequests.email,
        organization: pilotRequests.organization,
        status: pilotRequests.status,
        created_at: pilotRequests.createdAt,
        reviewed_at: pilotRequests.reviewedAt,
      })
      .from(pilotRequests)
      .orderBy(desc(pilotRequests.createdAt))
      .limit(100);
    return NextResponse.json({ requests: data }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      {
        error:
          "Pilot requests are unavailable. Apply the database migration and verify DATABASE_URL.",
      },
      { status: 503 },
    );
  }
}
