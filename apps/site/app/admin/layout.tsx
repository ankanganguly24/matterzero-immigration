import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { AuthLayout } from "@/features/auth/auth-layout";
import { AdminMfaGate } from "@/features/admin/admin-mfa-gate";
import { AdminShell } from "@/features/admin/admin-shell";
import styles from "@/features/admin/admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) redirect("/login");
  if (!process.env.MATTERZERO_ADMIN_EMAIL) {
    return (
      <AuthLayout>
        <section className={styles.card}>
          <p className={styles.eyebrow}>ADMIN SETUP</p>
          <h1>Admin access is not configured</h1>
          <p className={styles.description}>
            Add the server-only MATTERZERO_ADMIN_EMAIL setting to apps/site/.env.local, then restart
            the dev server.
          </p>
        </section>
      </AuthLayout>
    );
  }
  if (!isMatterZeroAdmin(claims.email)) notFound();
  if (claims.aal !== "aal2") {
    const email = typeof claims.email === "string" ? claims.email : "admin";
    return (
      <AuthLayout>
        <AdminMfaGate email={email} />
      </AuthLayout>
    );
  }

  const email = typeof claims.email === "string" ? claims.email : "admin";
  return <AdminShell adminEmail={email}>{children}</AdminShell>;
}
