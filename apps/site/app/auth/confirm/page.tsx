import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "@/features/auth/auth.module.css";

export const metadata: Metadata = {
  title: "Confirm sign in",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const allowedTypes = new Set(["email", "magiclink", "invite"]);

export default async function ConfirmSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const { token_hash: tokenHash, type } = await searchParams;
  if (!tokenHash || !type || !allowedTypes.has(type)) {
    redirect("/login?error=link");
  }

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-heading">
        <Link href="/" className={styles.brand} aria-label="MatterZero home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </Link>
        <p className={styles.eyebrow}>TEAM ACCESS</p>
        <h1 id="auth-heading">Confirm it’s you</h1>
        <p className={styles.intro}>
          Continue to securely verify this sign-in request. This step helps protect your link from
          being used by automated email scanners.
        </p>
        <form className={styles.form} action="/auth/confirm/verify" method="post">
          <input type="hidden" name="token_hash" value={tokenHash} />
          <input type="hidden" name="type" value={type} />
          <button className="button button--primary" type="submit">
            Confirm and sign in <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className={styles.footnote}>Only continue if you requested this sign-in link.</p>
      </section>
      <p className={styles.legal}>
        MatterZero organizes information for professional review. It does not provide legal advice.
      </p>
    </main>
  );
}
