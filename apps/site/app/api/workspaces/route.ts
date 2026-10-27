import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDashboardAccess } from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { workspaceMembers, workspaces } from "@/lib/db/schema";

const organizationTypes = new Set(["consultancy", "law_firm", "in_house", "other"]);
const markets = new Set(["india", "united_states", "other"]);
const teamSizes = new Set(["1", "2-5", "6-15", "16+"]);
const focuses = new Set(["business", "student", "family", "other"]);

function accessError(reason: "unauthenticated" | "not_granted" | "unavailable") {
  const status = reason === "unauthenticated" ? 401 : reason === "not_granted" ? 404 : 503;
  const error =
    reason === "unauthenticated"
      ? "Sign in to continue."
      : reason === "not_granted"
        ? "Workspace access is not available for this account."
        : "Workspace access could not be verified. Please try again shortly.";
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const access = await getDashboardAccess();
  if (!access.ok) return accessError(access.reason);
  if (access.user.isSuperAdmin && access.user.aal !== "aal2") {
    return NextResponse.json(
      { error: "Complete admin authenticator verification." },
      { status: 403 },
    );
  }

  try {
    const db = getDb();
    const rows = access.user.isSuperAdmin
      ? await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
            organizationType: workspaces.organizationType,
            market: workspaces.market,
            teamSize: workspaces.teamSize,
            primaryFocus: workspaces.primaryFocus,
            createdAt: workspaces.createdAt,
          })
          .from(workspaces)
          .orderBy(desc(workspaces.createdAt))
          .limit(100)
      : await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
            organizationType: workspaces.organizationType,
            market: workspaces.market,
            teamSize: workspaces.teamSize,
            primaryFocus: workspaces.primaryFocus,
            createdAt: workspaces.createdAt,
          })
          .from(workspaces)
          .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
          .where(eq(workspaceMembers.userId, access.user.userId))
          .orderBy(desc(workspaces.createdAt))
          .limit(100);
    return NextResponse.json({ workspaces: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Workspaces are unavailable. Check the database migration and server connection." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Request origin was rejected." }, { status: 403 });
  }
  const access = await getDashboardAccess();
  if (!access.ok) return accessError(access.reason);
  if (access.user.isSuperAdmin && access.user.aal !== "aal2") {
    return NextResponse.json(
      { error: "Complete admin authenticator verification." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid workspace details." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Enter valid workspace details." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const organizationType = input.organizationType;
  const market = input.market;
  const teamSize = input.teamSize;
  const primaryFocus = input.primaryFocus;

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json(
      { error: "Workspace name must be between 2 and 120 characters." },
      { status: 400 },
    );
  }
  if (typeof organizationType !== "string" || !organizationTypes.has(organizationType)) {
    return NextResponse.json({ error: "Choose a valid organization type." }, { status: 400 });
  }
  if (typeof market !== "string" || !markets.has(market)) {
    return NextResponse.json({ error: "Choose a valid market." }, { status: 400 });
  }
  if (typeof teamSize !== "string" || !teamSizes.has(teamSize)) {
    return NextResponse.json({ error: "Choose a valid team size." }, { status: 400 });
  }
  if (typeof primaryFocus !== "string" || !focuses.has(primaryFocus)) {
    return NextResponse.json({ error: "Choose a valid primary workflow." }, { status: 400 });
  }

  try {
    const db = getDb();
    const workspace = await db.transaction(async (transaction) => {
      const [created] = await transaction
        .insert(workspaces)
        .values({
          name,
          organizationType:
            organizationType as (typeof workspaces.$inferInsert)["organizationType"],
          market: market as (typeof workspaces.$inferInsert)["market"],
          teamSize: teamSize as (typeof workspaces.$inferInsert)["teamSize"],
          primaryFocus: primaryFocus as (typeof workspaces.$inferInsert)["primaryFocus"],
          createdBy: access.user.userId,
        })
        .returning({ id: workspaces.id, name: workspaces.name });

      await transaction.insert(workspaceMembers).values({
        workspaceId: created.id,
        userId: access.user.userId,
        email: access.user.email,
        role: "owner",
      });
      return created;
    });

    return NextResponse.json(
      { workspace },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The workspace could not be created. Check the database migration and try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
