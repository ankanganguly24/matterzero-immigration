import type { Metadata } from "next";
import { InviteForm } from "@/features/admin/invite-form";
import { PilotRequests } from "@/features/admin/pilot-requests";
import styles from "@/features/admin/admin.module.css";

export const metadata: Metadata = { title: "Pilot", robots: { index: false, follow: false } };

export default function PilotPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>ACCESS MANAGEMENT</p>
          <h1 className={styles.pageTitle}>Pilot</h1>
          <p className={styles.pageDescription}>Review pilot requests and invite approved team members.</p>
        </div>
      </div>

      <section id="invite" className={styles.panel} aria-labelledby="invite-heading">
        <div className={styles.panelHeading}>
          <div>
            <h2 id="invite-heading" className={styles.panelTitle}>Invite a teammate</h2>
            <p className={styles.panelDescription}>Send a secure sign-in link to a team member.</p>
          </div>
          <span className={styles.panelTag}>INVITATIONS</span>
        </div>
        {process.env.SUPABASE_SECRET_KEY ? (
          <InviteForm />
        ) : (
          <p className={styles.error} role="alert">
            Add the server-only SUPABASE_SECRET_KEY to apps/site/.env.local, then restart the dev
            server. Never prefix this key with NEXT_PUBLIC_.
          </p>
        )}
      </section>

      <section id="requests" className={styles.panel} aria-labelledby="requests-heading">
        <div className={styles.panelHeading}>
          <div>
            <h2 id="requests-heading" className={styles.panelTitle}>Pilot requests</h2>
            <p className={styles.panelDescription}>Review new requests and invite teams when approved.</p>
          </div>
          <span className={styles.panelTag}>REQUESTS</span>
        </div>
        <PilotRequests />
      </section>
    </div>
  );
}
