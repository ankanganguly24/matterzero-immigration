import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { AuthLayout } from "@/features/auth/auth-layout";
import styles from "@/features/auth/auth.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signed in",
  robots: { index: false, follow: false },
};

export default async function AuthCompletePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");
  if (isMatterZeroAdmin(data.claims.email)) redirect("/admin");

  return (
    <AuthLayout>
      <section className={`${styles.card} ${styles.complete}`} aria-labelledby="auth-heading">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <p className={styles.eyebrow}>ACCESS VERIFIED</p>
        <h1 id="auth-heading">You’re signed in.</h1>
        <p className={styles.intro}>
          Authentication is working. The team workspace will be added in a later step.
        </p>
        <form action="/auth/signout" method="post">
          <button className="button button--secondary" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </AuthLayout>
  );
}
