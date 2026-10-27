import { notFound, redirect } from "next/navigation";
import { WorkspaceSection } from "@/features/dashboard/workspace-pages";
import { EvidenceWorkspace } from "@/features/evidence-workspace/evidence-workspace";
import { getDashboardAccess, getWorkspaceForUser } from "@/lib/dashboard/access";
import { getDemoMatterVersionHash } from "@/lib/demo/matter";

export async function WorkspaceSectionRoute({
  workspaceId,
  section,
}: {
  workspaceId: string;
  section: "matters" | "collector" | "chronology" | "review" | "sample";
}) {
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    notFound();
  }
  const workspace = await getWorkspaceForUser(access.user, workspaceId);
  if (!workspace) notFound();
  if (section === "sample") {
    return (
      <EvidenceWorkspace
        versionHash={getDemoMatterVersionHash()}
        canApprove={access.user.isSuperAdmin}
      />
    );
  }
  return <WorkspaceSection workspace={workspace} section={section} />;
}
