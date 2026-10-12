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
          Share your work email and organization to discuss one intake or document-follow-up
          workflow. The applicant workspace is still in development. Please don’t include applicant
          information or case details.
        </p>
        <p className={styles.privacy}>
          <Link href="/workflow-preview#capabilities">Check current capabilities</Link>
          {" · "}
          <Link href="/data-handling">Read how we handle data</Link>
        </p>
        <PilotRequestForm />
        <div className={styles.pilotDetails}>
          <h2>What happens next?</h2>
          <p>
            Ankan reviews the request and follows up by email after review. This page confirms
            receipt; we do not send an automatic acknowledgement email or promise a fixed response
            time.
          </p>
          <p>
            The first discussion covers your current workflow, staff effort, product fit, setup,
            data handling, and pricing. Submitting a request does not grant access or commit you to
            a paid pilot.
          </p>
          <details>
            <summary>What we agree before starting</summary>
            <p>
              Duration, case and user limits, available capabilities, information handoff, total fee
              and any additional costs, setup responsibilities, support, and export or exit
              arrangements.
            </p>
            <p>
              We also agree how to measure value against your current process: staff time per file,
              follow-up touches, and time until professional review. No savings are guaranteed.
            </p>
          </details>
        </div>
        <p className={styles.footnote}>
          <Link href="/login" data-analytics-event="sign_in_from_pilot_clicked">
            Already invited? Sign in
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
