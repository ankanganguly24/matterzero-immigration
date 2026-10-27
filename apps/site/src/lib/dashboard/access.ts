import "server-only";
import { and, eq } from "drizzle-orm";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { getDb } from "@/lib/db";
import { accessGrants, workspaceMembers, workspaces } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export type DashboardUser = {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  aal: unknown;
};

export type DashboardAccess =
  | { ok: true; user: DashboardUser }
  | { ok: false; reason: "unauthenticated" | "not_granted" | "unavailable" };

export async function getDashboardAccess(): Promise<DashboardAccess> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || typeof claims?.sub !== "string") return { ok: false, reason: "unauthenticated" };

  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  if (!email) return { ok: false, reason: "not_granted" };

  const isSuperAdmin = isMatterZeroAdmin(email);
  if (!isSuperAdmin) {
    try {
      const [grant] = await getDb()
        .select({ email: accessGrants.email })
        .from(accessGrants)
        .where(eq(accessGrants.email, email))
        .limit(1);
      if (!grant) return { ok: false, reason: "not_granted" };
    } catch {
      return { ok: false, reason: "unavailable" };
    }
  }

  return {
    ok: true,
    user: { userId: claims.sub, email, isSuperAdmin, aal: claims.aal },
  };
}

export async function getWorkspaceForUser(user: DashboardUser, workspaceId: string) {
  const db = getDb();
  const [workspace] = await db
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
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace || user.isSuperAdmin) return workspace ?? null;

  const [userMembership] = await db
    .select({ workspaceId: workspaceMembers.workspaceId })
    .from(workspaceMembers)
    .where(
      and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.userId)),
    )
    .limit(1);

  return userMembership ? workspace : null;
}
