import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/auth-layout";
import { MagicLinkForm } from "@/features/auth/magic-link-form";
import styles from "@/features/auth/auth.module.css";

export const metadata: Metadata = {
  title: "Staff sign in",
  description: "Secure staff sign-in for MatterZero.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthLayout>
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
        <h1 id="auth-heading">Sign in to MatterZero</h1>
        <p className={styles.intro}>
          Enter your invited work email. We’ll send you a secure sign-in link.
        </p>
        {error === "link" ? (
          <p className={styles.alert} role="alert">
            That sign-in link is invalid or has expired. Request a fresh link to continue.
          </p>
        ) : null}
        <MagicLinkForm />
        <p className={styles.footnote}>Access is currently by invitation only.</p>
      </section>
    </AuthLayout>
  );
}
