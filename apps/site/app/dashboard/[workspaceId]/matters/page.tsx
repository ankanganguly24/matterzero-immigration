import { WorkspaceSectionRoute } from "@/features/dashboard/workspace-section-route";

export const dynamic = "force-dynamic";

export default async function MattersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return <WorkspaceSectionRoute workspaceId={workspaceId} section="matters" />;
}
