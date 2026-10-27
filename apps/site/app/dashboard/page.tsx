import type { Metadata } from "next";
import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { WorkspaceSetupForm } from "@/features/dashboard/workspace-setup-form";
import styles from "@/features/dashboard/dashboard.module.css";
import { getDashboardAccess } from "@/lib/dashboard/access";
import { getDb } from "@/lib/db";
import { workspaceMembers, workspaces } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your workspaces",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    if (access.reason === "not_granted") notFound();
    return (
      <main id="main-content" className={styles.accessError}>
        <p className={styles.eyebrow}>WORKSPACE SETUP</p>
        <h1>We couldn’t load your workspaces.</h1>
        <p>Try again shortly. Your workspace access could not be verified.</p>
      </main>
    );
  }

  let workspacesForUser: Array<{
    id: string;
    name: string;
    organizationType: string;
    market: string;
    teamSize: string;
    primaryFocus: string;
  }>;
  try {
    const db = getDb();
    workspacesForUser = access.user.isSuperAdmin
      ? await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
            organizationType: workspaces.organizationType,
            market: workspaces.market,
            teamSize: workspaces.teamSize,
            primaryFocus: workspaces.primaryFocus,
          })
          .from(workspaces)
          .orderBy(desc(workspaces.createdAt))
          .limit(100)
      : await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
            organizationType: workspaces.organizationType,
            market: workspaces.market,
            teamSize: workspaces.teamSize,
            primaryFocus: workspaces.primaryFocus,
          })
          .from(workspaces)
          .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
          .where(
            and(
              eq(workspaceMembers.userId, access.user.userId),
              eq(workspaceMembers.email, access.user.email),
            ),
          )
          .orderBy(desc(workspaces.createdAt))
          .limit(100);
  } catch {
    return (
      <main id="main-content" className={styles.accessError}>
        <p className={styles.eyebrow}>WORKSPACE SETUP</p>
        <h1>Workspace setup needs a database migration.</h1>
        <p>
          The workspace tables are not available yet. Apply the latest Supabase migration, then
          reload this page.
        </p>
      </main>
    );
  }

  const displayName = access.user.email.split("@")[0]?.replace(/[._-]+/g, " ") || "Team member";

  return (
    <main id="main-content" className={styles.landing}>
      <header className={styles.landingHeader}>
        <Link href="/" className={styles.brand} aria-label="MatterZero home">
          <span className={styles.brandMark}>M</span>
          <span>MatterZero</span>
        </Link>
        <div className={styles.userMenu}>
          <span>{displayName}</span>
          <form action="/auth/signout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <div className={styles.landingContent}>
        <p className={styles.eyebrow}>{access.user.isSuperAdmin ? "SUPERADMIN" : "TEAM ACCESS"}</p>
        <h1>Your workspaces</h1>
        <p className={styles.lede}>
          Create a workspace for your immigration team, then organize its matters and review work in
          one place.
        </p>

        <section className={styles.setupCard} aria-labelledby="create-heading">
          <div className={styles.cardHeading}>
            <span className={styles.stepNumber}>01</span>
            <div>
              <p className={styles.cardEyebrow}>GET STARTED</p>
              <h2 id="create-heading">Create a workspace</h2>
              <p>Set up your team space. You can change its details later.</p>
            </div>
          </div>
          <WorkspaceSetupForm />
        </section>

        {workspacesForUser.length > 0 ? (
          <section className={styles.workspacesSection} aria-labelledby="existing-heading">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.cardEyebrow}>AVAILABLE TO YOU</p>
                <h2 id="existing-heading">Open a workspace</h2>
              </div>
              <span>{workspacesForUser.length} available</span>
            </div>
            <ul className={styles.workspaceList}>
              {workspacesForUser.map((workspace) => (
                <li key={workspace.id}>
                  <Link href={`/dashboard/${workspace.id}`} className={styles.workspaceCard}>
                    <span className={styles.workspaceIcon} aria-hidden="true">
                      {workspace.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className={styles.workspaceDetails}>
                      <strong>{workspace.name}</strong>
                      <small>
                        {workspace.organizationType.replaceAll("_", " ")} ·{" "}
                        {workspace.market.replaceAll("_", " ")}
                      </small>
                    </span>
                    <span className={styles.workspaceArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
