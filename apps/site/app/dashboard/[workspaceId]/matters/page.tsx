import { and, desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { MatterHub, type MatterListItem } from "@/features/dashboard/matter-hub";
import {
  getDashboardAccess,
  getWorkspaceForUser,
  getWorkspaceMembershipRole,
} from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { matters, workspaceMembers } from "@/lib/db/schema";
import styles from "@/features/dashboard/dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function MattersPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ create?: string; import?: string }>;
}) {
  const { workspaceId } = await params;
  const { create, import: importQuery } = await searchParams;
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    notFound();
  }
  const workspace = await getWorkspaceForUser(access.user, workspaceId);
  const role = await getWorkspaceMembershipRole(access.user.userId, workspaceId);
  if (!workspace || !role || !["owner", "admin", "attorney", "paralegal"].includes(role))
    notFound();

  let records: (Omit<MatterListItem, "updatedAt"> & { updatedAt: Date })[];
  try {
    records = await getDb()
      .select({
        id: matters.id,
        firstName: matters.firstName,
        lastName: matters.lastName,
        email: matters.email,
        petitionType: matters.petitionType,
        status: matters.status,
        updatedAt: matters.updatedAt,
        assignedAttorney: workspaceMembers.email,
      })
      .from(matters)
      .leftJoin(
        workspaceMembers,
        and(
          eq(workspaceMembers.workspaceId, matters.workspaceId),
          eq(workspaceMembers.userId, matters.assignedAttorneyUserId),
        ),
      )
      .where(eq(matters.workspaceId, workspaceId))
      .orderBy(desc(matters.updatedAt))
      .limit(500);
  } catch {
    return (
      <main className={styles.accessError}>
        <p className={styles.eyebrow}>MATTERS</p>
        <h1>Matters migration required.</h1>
        <p>Apply the latest Supabase migration, then reload this page.</p>
      </main>
    );
  }

  return (
    <MatterHub
      workspaceId={workspaceId}
      matters={records.map((record) => ({ ...record, updatedAt: record.updatedAt.toISOString() }))}
      canManage={["owner", "admin", "attorney"].includes(role)}
      initialCreateOpen={create === "1" && ["owner", "admin", "attorney"].includes(role)}
      initialImportOpen={importQuery === "1" && ["owner", "admin", "attorney"].includes(role)}
    />
  );
}
