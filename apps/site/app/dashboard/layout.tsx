import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { AdminMfaGate } from "@/features/admin/admin-mfa-gate";
import { AuthLayout } from "@/features/auth/auth-layout";
import { TeamAccessTracker } from "@/features/analytics/team-access-tracker";
import styles from "@/features/dashboard/dashboard.module.css";
import { getDashboardAccess } from "@/lib/dashboard/access";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
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

  return (
    <div className={styles.dashboardFrame}>
      <TeamAccessTracker userId={access.user.userId} />
      {children}
    </div>
  );
}
