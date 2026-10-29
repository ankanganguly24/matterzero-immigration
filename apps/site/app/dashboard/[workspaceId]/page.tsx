import { count, desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { WorkspaceOverview } from "@/features/dashboard/workspace-pages";
import { getDashboardAccess, getWorkspaceForUser } from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { matters, type MatterStatus } from "@/lib/db/schema";

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
  let overviewData: {
    counts: Record<MatterStatus, number>;
    recentMatters: {
      id: string;
      firstName: string;
      lastName: string;
      petitionType: string;
      status: MatterStatus;
      updatedAt: string;
    }[];
  } | null = null;
  try {
    const db = getDb();
    const [statusCounts, recentMatters] = await Promise.all([
      db
        .select({ status: matters.status, count: count() })
        .from(matters)
        .where(eq(matters.workspaceId, workspaceId))
        .groupBy(matters.status),
      db
        .select({
          id: matters.id,
          firstName: matters.firstName,
          lastName: matters.lastName,
          petitionType: matters.petitionType,
          status: matters.status,
          updatedAt: matters.updatedAt,
        })
        .from(matters)
        .where(eq(matters.workspaceId, workspaceId))
        .orderBy(desc(matters.updatedAt))
        .limit(5),
    ]);
    const counts: Record<MatterStatus, number> = {
      intake: 0,
      parsing: 0,
      conflict_flagged: 0,
      ready_for_export: 0,
    };
    for (const row of statusCounts) counts[row.status] = row.count;
    overviewData = {
      counts,
      recentMatters: recentMatters.map((matter) => ({
        ...matter,
        updatedAt: matter.updatedAt.toISOString(),
      })),
    };
  } catch {
    overviewData = null;
  }
  return <WorkspaceOverview workspace={workspace} overviewData={overviewData} />;
}
