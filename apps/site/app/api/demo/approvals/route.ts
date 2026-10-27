import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { demoMatterApprovals } from "@/lib/db/schema";
import { DEMO_MATTER_ID, getDemoMatterVersionHash } from "@/lib/demo/matter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authorization = await requireAdmin(request, true);
  if (authorization.error) return authorization.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "An approval request is required." }, { status: 400 });
  }

  const { matterId, versionHash } = body as { matterId?: unknown; versionHash?: unknown };
  const currentVersionHash = getDemoMatterVersionHash();
  if (matterId !== DEMO_MATTER_ID || versionHash !== currentVersionHash) {
    return NextResponse.json(
      { error: "This sample version is unknown or has changed. Refresh and review it again." },
      { status: 409 },
    );
  }

  const reviewerId = authorization.claims.sub;
  const reviewerEmail = authorization.claims.email;
  if (typeof reviewerId !== "string" || typeof reviewerEmail !== "string") {
    return NextResponse.json(
      { error: "Reviewer identity could not be verified." },
      { status: 403 },
    );
  }

  try {
    const db = getDb();
    await db
      .insert(demoMatterApprovals)
      .values({
        matterId: DEMO_MATTER_ID,
        versionHash: currentVersionHash,
        reviewerId,
        reviewerEmail: reviewerEmail.trim().toLowerCase(),
      })
      .onConflictDoNothing({
        target: [demoMatterApprovals.matterId, demoMatterApprovals.versionHash],
      });

    return NextResponse.json(
      { approved: true, matterId: DEMO_MATTER_ID, versionHash: currentVersionHash },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Approval storage is unavailable. Check the database migration and server connection.",
      },
      { status: 503 },
    );
  }
}

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

    return NextResponse.json(
      { approved: Boolean(approval) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Approval storage is unavailable. Check the database migration and server connection.",
      },
      { status: 503 },
    );
  }
}
