import { redirect } from "next/navigation";

export default async function BulkIngestionRedirect({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  redirect(`/dashboard/${workspaceId}/matters?import=1`);
}
