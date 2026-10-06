import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/features/auth/magic-link-form";

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
    <main id="main-content" className="auth-page">
      <section className="auth-card" aria-labelledby="auth-heading">
        <Link href="/" className="auth-brand" aria-label="MatterZero home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </Link>
        <p className="auth-eyebrow">TEAM ACCESS</p>
        <h1 id="auth-heading">Sign in to MatterZero</h1>
        <p className="auth-intro">
          Enter your invited work email. We’ll send you a secure sign-in link.
        </p>
        {error === "link" ? (
          <p className="auth-alert" role="alert">
            That sign-in link is invalid or has expired. Request a fresh link to continue.
          </p>
        ) : null}
        <MagicLinkForm />
        <p className="auth-footnote">Access is currently by invitation only.</p>
      </section>
      <p className="auth-legal">
        MatterZero organizes information for professional review. It does not provide legal advice.
      </p>
    </main>
  );
}
