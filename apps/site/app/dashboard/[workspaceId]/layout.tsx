import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { AdminMfaGate } from "@/features/admin/admin-mfa-gate";
import { AuthLayout } from "@/features/auth/auth-layout";
import { WorkspaceShell } from "@/features/dashboard/workspace-shell";
import styles from "@/features/dashboard/dashboard.module.css";
import { getDashboardAccess, getWorkspaceForUser } from "@/lib/dashboard/access";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const access = await getDashboardAccess();
  if (!access.ok) {
    if (access.reason === "unauthenticated") redirect("/login");
    if (access.reason === "not_granted") notFound();
    return (
      <main className={styles.accessError}>
        <p className={styles.eyebrow}>WORKSPACE ACCESS</p>
        <h1>We couldn’t verify this account.</h1>
        <p>Try again shortly. Workspace access is checked on the server before it is shown.</p>
      </main>
    );
  }
  if (access.user.isSuperAdmin && access.user.aal !== "aal2") {
    return (
      <AuthLayout>
        <AdminMfaGate email={access.user.email} />
      </AuthLayout>
    );
  }
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(workspaceId)
  ) {
    notFound();
  }

  let workspace: Awaited<ReturnType<typeof getWorkspaceForUser>>;
  try {
    workspace = await getWorkspaceForUser(access.user, workspaceId);
  } catch {
    return (
      <main className={styles.accessError}>
        <p className={styles.eyebrow}>WORKSPACE ACCESS</p>
        <h1>We couldn’t load this workspace.</h1>
        <p>Check the workspace migration and database connection, then try again.</p>
      </main>
    );
  }
  if (!workspace) notFound();
  return (
    <WorkspaceShell workspace={workspace} email={access.user.email}>
      {children}
    </WorkspaceShell>
  );
}
