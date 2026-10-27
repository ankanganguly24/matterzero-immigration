import { desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { WorkspaceSettings } from "@/features/dashboard/workspace-settings";
import {
  getDashboardAccess,
  getWorkspaceForUser,
  getWorkspaceRoleForUser,
} from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { workspaceAuditEvents, workspaceMembers, workspaces } from "@/lib/db/schema";
import styles from "@/features/dashboard/dashboard.module.css";

export const dynamic = "force-dynamic";

async function loadSettings(workspaceId: string) {
  const db = getDb();
  const [profile] = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      organizationType: workspaces.organizationType,
      market: workspaces.market,
      teamSize: workspaces.teamSize,
      primaryFocus: workspaces.primaryFocus,
      practiceAreas: workspaces.practiceAreas,
      officeLocation: workspaces.officeLocation,
      deadlinePaddingDays: workspaces.deadlinePaddingDays,
      firmContext: workspaces.firmContext,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  const [members, events] = await Promise.all([
    db
      .select({
        email: workspaceMembers.email,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId))
      .orderBy(workspaceMembers.joinedAt),
    db
      .select({
        eventType: workspaceAuditEvents.eventType,
        actorEmail: workspaceAuditEvents.actorEmail,
        changedFields: workspaceAuditEvents.changedFields,
        occurredAt: workspaceAuditEvents.occurredAt,
      })
      .from(workspaceAuditEvents)
      .where(eq(workspaceAuditEvents.workspaceId, workspaceId))
      .orderBy(desc(workspaceAuditEvents.occurredAt))
      .limit(50),
  ]);

  return { profile, members, events };
}

export default async function WorkspaceSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ workspaceId }, query] = await Promise.all([params, searchParams]);
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    notFound();
  }
  const [workspace, role] = await Promise.all([
    getWorkspaceForUser(access.user, workspaceId),
    getWorkspaceRoleForUser(access.user, workspaceId),
  ]);
  if (!workspace || !role) notFound();

  let settings: Awaited<ReturnType<typeof loadSettings>>;
  try {
    settings = await loadSettings(workspaceId);
  } catch {
    return (
      <main className={styles.accessError}>
        <p className={styles.eyebrow}>FIRM SETTINGS</p>
        <h1>Settings migration required.</h1>
        <p>Apply the workspace preferences and audit migration, then reload this page.</p>
      </main>
    );
  }

  if (!settings.profile) notFound();

  return (
    <WorkspaceSettings
      workspace={settings.profile}
      members={settings.members.map((member) => ({
        ...member,
        joinedAt: member.joinedAt.toISOString(),
      }))}
      events={settings.events.map((event) => ({
        ...event,
        occurredAt: event.occurredAt.toISOString(),
      }))}
      role={role}
      initialTab={query.tab ?? "profile"}
    />
  );
}
