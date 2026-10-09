import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isMatterZeroAdmin } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { accessGrants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AuthLayout } from "@/features/auth/auth-layout";
import { TeamAccessTracker } from "@/features/analytics/team-access-tracker";
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

  const email = typeof data.claims.email === "string" ? data.claims.email.trim().toLowerCase() : "";
  if (!email) redirect("/login");

  let hasAccess = false;
  let accessCheckFailed = false;
  try {
    const [grant] = await getDb()
      .select({ email: accessGrants.email })
      .from(accessGrants)
      .where(eq(accessGrants.email, email))
      .limit(1);
    hasAccess = Boolean(grant);
  } catch {
    accessCheckFailed = true;
  }

  if (!hasAccess) {
    return (
      <AuthLayout>
        <section className={`${styles.card} ${styles.complete}`} aria-labelledby="auth-heading">
          <p className={styles.eyebrow}>PILOT ACCESS</p>
          <h1 id="auth-heading">Your team access isn’t set up yet</h1>
          <p className={styles.intro}>
            {accessCheckFailed
              ? "We couldn’t verify pilot access right now. Please try again shortly or request a pilot for your team."
              : "This email is signed in, but it is not yet connected to a MatterZero pilot team. You can request a pilot and we’ll follow up with your team."}
          </p>
          <Link className="button button--primary" href="/request-pilot">
            Request a pilot
          </Link>
          <form action="/auth/signout" method="post">
            <button className="button button--secondary" type="submit">
              Sign out
            </button>
          </form>
        </section>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <TeamAccessTracker userId={data.claims.sub} />
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
