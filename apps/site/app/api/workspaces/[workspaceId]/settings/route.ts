import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  getDashboardAccess,
  getWorkspaceForUser,
  getWorkspaceRoleForUser,
} from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { workspaceAuditEvents, workspaces } from "@/lib/db/schema";

const organizationTypes = new Set(["consultancy", "law_firm", "in_house", "other"]);
const markets = new Set(["india", "united_states", "other"]);
const teamSizes = new Set(["1", "2-5", "6-15", "16+"]);
const focuses = new Set(["business", "student", "family", "other"]);

function errorResponse(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return errorResponse(403, "Request origin was rejected.");
  }

  const { workspaceId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(workspaceId)
  ) {
    return errorResponse(404, "Workspace not found.");
  }

  const access = await getDashboardAccess();
  if (!access.ok) {
    const status =
      access.reason === "unauthenticated" ? 401 : access.reason === "not_granted" ? 404 : 503;
    return errorResponse(status, "Workspace access could not be verified.");
  }
  if (access.user.isSuperAdmin && access.user.aal !== "aal2") {
    return errorResponse(403, "Complete admin authenticator verification.");
  }

  try {
    const role = await getWorkspaceRoleForUser(access.user, workspaceId);
    if (!role) return errorResponse(404, "Workspace not found.");
    if (!(role === "superadmin" || role === "owner" || role === "admin")) {
      return errorResponse(403, "Only workspace owners and admins can change settings.");
    }
    if (!(await getWorkspaceForUser(access.user, workspaceId))) {
      return errorResponse(404, "Workspace not found.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "Enter valid settings.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse(400, "Enter valid settings.");
    }

    const input = body as Record<string, unknown>;
    const updates: Partial<typeof workspaces.$inferInsert> = {};
    const changedProfile: string[] = [];
    const changedContext: string[] = [];

    if ("name" in input) {
      const value = typeof input.name === "string" ? input.name.trim() : "";
      if (value.length < 2 || value.length > 120)
        return errorResponse(400, "Workspace name must be 2–120 characters.");
      updates.name = value;
      changedProfile.push("name");
    }
    if ("organizationType" in input) {
      if (
        typeof input.organizationType !== "string" ||
        !organizationTypes.has(input.organizationType)
      ) {
        return errorResponse(400, "Choose a valid organization type.");
      }
      updates.organizationType =
        input.organizationType as (typeof workspaces.$inferInsert)["organizationType"];
      changedProfile.push("organizationType");
    }
    if ("market" in input) {
      if (typeof input.market !== "string" || !markets.has(input.market))
        return errorResponse(400, "Choose a valid market.");
      updates.market = input.market as (typeof workspaces.$inferInsert)["market"];
      changedProfile.push("market");
    }
    if ("teamSize" in input) {
      if (typeof input.teamSize !== "string" || !teamSizes.has(input.teamSize))
        return errorResponse(400, "Choose a valid team size.");
      updates.teamSize = input.teamSize as (typeof workspaces.$inferInsert)["teamSize"];
      changedProfile.push("teamSize");
    }
    if ("primaryFocus" in input) {
      if (typeof input.primaryFocus !== "string" || !focuses.has(input.primaryFocus))
        return errorResponse(400, "Choose a valid primary workflow.");
      updates.primaryFocus = input.primaryFocus as (typeof workspaces.$inferInsert)["primaryFocus"];
      changedProfile.push("primaryFocus");
    }
    if ("practiceAreas" in input) {
      const values = input.practiceAreas;
      if (
        !Array.isArray(values) ||
        values.length > 12 ||
        values.some(
          (value) =>
            typeof value !== "string" || value.trim().length < 1 || value.trim().length > 60,
        )
      ) {
        return errorResponse(
          400,
          "Add up to 12 practice areas, each no longer than 60 characters.",
        );
      }
      updates.practiceAreas = [...new Set(values.map((value) => (value as string).trim()))];
      changedProfile.push("practiceAreas");
    }
    if ("officeLocation" in input) {
      const value = typeof input.officeLocation === "string" ? input.officeLocation.trim() : "";
      if (value.length > 160)
        return errorResponse(400, "Office location must be 160 characters or less.");
      updates.officeLocation = value;
      changedProfile.push("officeLocation");
    }
    if ("deadlinePaddingDays" in input) {
      const value = input.deadlinePaddingDays;
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 90) {
        return errorResponse(400, "Deadline padding must be a whole number from 0 to 90 days.");
      }
      updates.deadlinePaddingDays = value;
      changedProfile.push("deadlinePaddingDays");
    }
    if ("firmContext" in input) {
      const value = typeof input.firmContext === "string" ? input.firmContext.trim() : "";
      if (value.length > 4000)
        return errorResponse(400, "Firm context must be 4,000 characters or less.");
      updates.firmContext = value;
      changedContext.push("firmContext");
    }
    if (changedProfile.length === 0 && changedContext.length === 0) {
      return errorResponse(400, "No supported settings were supplied.");
    }

    const db = getDb();
    const updated = await db.transaction(async (transaction) => {
      const [saved] = await transaction
        .update(workspaces)
        .set(updates)
        .where(eq(workspaces.id, workspaceId))
        .returning({ id: workspaces.id });
      if (!saved) throw new Error("Workspace disappeared during update.");

      const events = [];
      if (changedProfile.length) {
        events.push({
          workspaceId,
          actorUserId: access.user.userId,
          actorEmail: access.user.email,
          eventType: "workspace.profile_updated",
          changedFields: changedProfile,
        });
      }
      if (changedContext.length) {
        events.push({
          workspaceId,
          actorUserId: access.user.userId,
          actorEmail: access.user.email,
          eventType: "workspace.context_updated",
          changedFields: changedContext,
        });
      }
      if (events.length) await transaction.insert(workspaceAuditEvents).values(events);
      return saved;
    });

    return NextResponse.json(
      { workspace: { id: updated.id, ...updates } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return errorResponse(
      503,
      "Settings could not be saved. Check the workspace preferences migration and retry.",
    );
  }
}
