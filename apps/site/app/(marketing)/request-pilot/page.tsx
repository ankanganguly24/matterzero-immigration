import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/auth-layout";
import { PilotRequestForm } from "@/features/auth/pilot-request-form";
import styles from "@/features/auth/auth.module.css";

export const metadata: Metadata = {
  title: "Request a pilot",
  description: "Request early access to MatterZero for your team.",
  robots: { index: false, follow: false },
};

export default function RequestPilotPage() {
  return (
    <AuthLayout>
      <section className={styles.card} aria-labelledby="pilot-heading">
        <Link href="/" className={styles.brand} aria-label="MatterZero home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </Link>
        <p className={styles.eyebrow}>EARLY ACCESS</p>
        <h1 id="pilot-heading">Request a pilot</h1>
        <p className={styles.intro}>
          Share your work email and organization. We’ll follow up to discuss whether a pilot fits
          your team. Please don’t include applicant information or case details.
        </p>
        <PilotRequestForm />
        <p className={styles.footnote}>
          <Link href="/login" data-analytics-event="sign_in_from_pilot_clicked">
            Already invited? Sign in
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
