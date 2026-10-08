import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { InviteForm } from "@/features/admin/invite-form";
import { AdminMfaGate } from "@/features/admin/admin-mfa-gate";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { AuthLayout } from "@/features/auth/auth-layout";
import styles from "@/features/admin/admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin access",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
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

  const email = typeof claims.email === "string" ? claims.email : "admin";
  const isVerifiedWithMfa = claims.aal === "aal2";

  return (
    <AuthLayout>
      {isVerifiedWithMfa ? (
        <section className={styles.card} aria-labelledby="admin-heading">
          <p className={styles.eyebrow}>MATTERZERO · ADMIN</p>
          <h1 id="admin-heading">Invite a pilot teammate</h1>
          <p className={styles.description}>
            Send an invitation to someone on a pilot team. Only your allowlisted admin account with
            verified authenticator MFA can send invitations.
          </p>
          {process.env.SUPABASE_SECRET_KEY ? (
            <InviteForm />
          ) : (
            <p className={styles.error} role="alert">
              Add the server-only SUPABASE_SECRET_KEY to apps/site/.env.local, then restart the dev
              server. Never prefix this key with NEXT_PUBLIC_.
            </p>
          )}
        </section>
      ) : (
        <AdminMfaGate email={email} />
      )}
    </AuthLayout>
  );
}
