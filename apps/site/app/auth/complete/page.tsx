import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signed in",
  robots: { index: false, follow: false },
};

export default async function AuthCompletePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  return (
    <main id="main-content" className="auth-page">
      <section className="auth-card auth-card--complete" aria-labelledby="auth-heading">
        <span className="auth-success__icon" aria-hidden="true">
          ✓
        </span>
        <p className="auth-eyebrow">ACCESS VERIFIED</p>
        <h1 id="auth-heading">You’re signed in.</h1>
        <p className="auth-intro">
          Authentication is working. The team workspace will be added in a later step.
        </p>
        <form action="/auth/signout" method="post">
          <button className="button button--secondary auth-submit" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
