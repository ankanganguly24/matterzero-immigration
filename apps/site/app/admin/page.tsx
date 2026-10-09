import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/features/admin/admin.module.css";

export const metadata: Metadata = { title: "Overview", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>ADMIN WORKSPACE</p>
          <h1 className={styles.pageTitle}>Overview</h1>
          <p className={styles.pageDescription}>A clear view of pilot access and the next action for your team.</p>
        </div>
        <Link className={styles.primaryLink} href="/admin/pilot">Open pilot workspace <span aria-hidden="true">→</span></Link>
      </div>

      <section className={styles.overviewGrid} aria-label="Workspace shortcuts">
        <Link className={styles.overviewCard} href="/admin/pilot#requests">
          <span className={styles.overviewIcon} aria-hidden="true">01</span>
          <span className={styles.overviewCardBody}>
            <span className={styles.overviewCardTitle}>Pilot requests</span>
            <span className={styles.overviewCardDescription}>Review new teams and decide who is ready to join.</span>
          </span>
          <span className={styles.cardArrow} aria-hidden="true">↗</span>
        </Link>
        <Link className={styles.overviewCard} href="/admin/pilot#invite">
          <span className={styles.overviewIcon} aria-hidden="true">02</span>
          <span className={styles.overviewCardBody}>
            <span className={styles.overviewCardTitle}>Invite a teammate</span>
            <span className={styles.overviewCardDescription}>Send a secure sign-in link to an approved team member.</span>
          </span>
          <span className={styles.cardArrow} aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className={styles.overviewNote}>
        <span className={styles.noteDot} aria-hidden="true" />
        <div>
          <h2>Pilot access</h2>
          <p>Requests and invitations are managed together. Approving a request grants access and sends an invitation.</p>
        </div>
        <Link href="/admin/pilot">Go to Pilot <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
