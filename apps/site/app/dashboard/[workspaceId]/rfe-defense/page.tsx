import { notFound, redirect } from "next/navigation";
import { WorkspaceConcept } from "@/features/dashboard/workspace-concepts";
import { getDashboardAccess, getWorkspaceForUser } from "@/lib/dashboard/access";

export const dynamic = "force-dynamic";

export default async function RfeDefensePage({
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

  return <WorkspaceConcept workspace={workspace} workflow="rfe" />;
}
