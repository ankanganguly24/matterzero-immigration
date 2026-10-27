import { notFound, redirect } from "next/navigation";
import { WorkspaceOverview } from "@/features/dashboard/workspace-pages";
import { getDashboardAccess, getWorkspaceForUser } from "@/lib/dashboard/access";

export const dynamic = "force-dynamic";

export default async function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    notFound();
  }
  const workspace = await getWorkspaceForUser(access.user, workspaceId);
  if (!workspace) notFound();
  return <WorkspaceOverview workspace={workspace} />;
}
