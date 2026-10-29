import { and, asc, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
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

const pageSize = 25;
const matterStatuses = ["intake", "parsing", "conflict_flagged", "ready_for_export"] as const;
const sortOptions = [
  "updated_desc",
  "name_asc",
  "name_desc",
  "petition_asc",
  "status_asc",
  "attorney_asc",
] as const;
type MatterSort = (typeof sortOptions)[number];
const userIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parsePage(value?: string) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, 1_000_000) : 1;
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}

export default async function MattersPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{
    create?: string;
    import?: string;
    q?: string;
    status?: string;
    assigned?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const search = query.q?.trim().slice(0, 120) ?? "";
  const status = matterStatuses.find((item) => item === query.status) ?? "all";
  const assignedTo =
    query.assigned === "unassigned" || (query.assigned && userIdPattern.test(query.assigned))
      ? query.assigned
      : "all";
  const sort = sortOptions.find((item) => item === query.sort) ?? "updated_desc";
  const requestedPage = parsePage(query.page);
  const { create, import: importQuery } = query;
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
  let totalWorkspaceCount = 0;
  let totalCount = 0;
  let currentPage = 1;
  let assignees: { userId: string; email: string }[] = [];
  try {
    const db = getDb();
    const conditions = [eq(matters.workspaceId, workspaceId)];
    if (status !== "all") conditions.push(eq(matters.status, status));
    if (assignedTo === "unassigned") {
      conditions.push(isNull(matters.assignedAttorneyUserId));
    } else if (userIdPattern.test(assignedTo)) {
      conditions.push(eq(matters.assignedAttorneyUserId, assignedTo));
    }
    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      conditions.push(
        or(
          ilike(sql`(${matters.firstName} || ' ' || ${matters.lastName})`, pattern),
          ilike(matters.email, pattern),
          ilike(matters.petitionType, pattern),
          ilike(workspaceMembers.email, pattern),
        )!,
      );
    }
    const where = and(...conditions);
    const [{ value: workspaceCountValue }] = await db
      .select({ value: count() })
      .from(matters)
      .where(eq(matters.workspaceId, workspaceId));
    totalWorkspaceCount = workspaceCountValue;
    const [{ value: countValue }] = await db
      .select({ value: count() })
      .from(matters)
      .leftJoin(
        workspaceMembers,
        and(
          eq(workspaceMembers.workspaceId, matters.workspaceId),
          eq(workspaceMembers.userId, matters.assignedAttorneyUserId),
        ),
      )
      .where(where);
    totalCount = countValue;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    currentPage = Math.min(requestedPage, totalPages);
    const ordering: Record<MatterSort, ReturnType<typeof asc>[]> = {
      updated_desc: [desc(matters.updatedAt), desc(matters.id)],
      name_asc: [asc(matters.lastName), asc(matters.firstName), asc(matters.id)],
      name_desc: [desc(matters.lastName), desc(matters.firstName), desc(matters.id)],
      petition_asc: [asc(matters.petitionType), asc(matters.lastName), asc(matters.id)],
      status_asc: [asc(matters.status), desc(matters.updatedAt), desc(matters.id)],
      attorney_asc: [asc(workspaceMembers.email), desc(matters.updatedAt), desc(matters.id)],
    };

    [records, assignees] = await Promise.all([
      db
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
      .where(where)
      .orderBy(...ordering[sort])
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize),
      db
        .select({ userId: workspaceMembers.userId, email: workspaceMembers.email })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, workspaceId))
        .orderBy(asc(workspaceMembers.email))
        .limit(200),
    ]);
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
      key={search}
      workspaceId={workspaceId}
      matters={records.map((record) => ({ ...record, updatedAt: record.updatedAt.toISOString() }))}
      totalWorkspaceCount={totalWorkspaceCount}
      totalCount={totalCount}
      page={currentPage}
      pageSize={pageSize}
      assignees={assignees}
      query={{ search, status, assignedTo, sort }}
      canManage={["owner", "admin", "attorney"].includes(role)}
      initialCreateOpen={create === "1" && ["owner", "admin", "attorney"].includes(role)}
      initialImportOpen={importQuery === "1" && ["owner", "admin", "attorney"].includes(role)}
    />
  );
}
