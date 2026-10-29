import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { EvidenceWorkspace } from "@/features/evidence-workspace/evidence-workspace";
import {
  getDashboardAccess,
  getWorkspaceForUser,
  getWorkspaceMembershipRole,
} from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { matters } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function MatterCommandCenterPage({
  params,
}: {
  params: Promise<{ workspaceId: string; matterId: string }>;
}) {
  const { workspaceId, matterId } = await params;
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    notFound();
  }

  const [workspace, role] = await Promise.all([
    getWorkspaceForUser(access.user, workspaceId),
    getWorkspaceMembershipRole(access.user.userId, workspaceId),
  ]);
  if (!workspace || !role || !["owner", "admin", "attorney", "paralegal"].includes(role)) {
    notFound();
  }

  const [matter] = await getDb()
    .select({
      id: matters.id,
      firstName: matters.firstName,
      lastName: matters.lastName,
      petitionType: matters.petitionType,
      status: matters.status,
    })
    .from(matters)
    .where(and(eq(matters.workspaceId, workspaceId), eq(matters.id, matterId)))
    .limit(1);

  if (!matter) notFound();

  return <EvidenceWorkspace canApprove={false} matter={matter} />;
}
