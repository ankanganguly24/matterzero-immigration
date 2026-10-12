import type { Metadata } from "next";
import { PilotArticleLayout } from "@/features/pilot/pilot-article-layout";
import styles from "@/features/pilot/pilot-information.module.css";

export const metadata: Metadata = {
  title: "Data handling during early access",
  description:
    "What MatterZero collects today, who can access it, and what must be agreed before applicant records are used.",
  alternates: { canonical: "/data-handling" },
  openGraph: {
    title: "Data handling during early access | MatterZero",
    description: "Current collection, access, analytics, and boundaries for future applicant data.",
    url: "/data-handling",
  },
};

export default function DataHandlingPage() {
  return (
    <PilotArticleLayout
      eyebrow="Current early access · Updated 12 October 2026"
      title="What we collect and how we use it."
      description="The current site handles pilot enquiries and invited account access. It does not provide a place to upload applicant records or documents."
      sidebarTitle="Before sharing any data"
      sidebarDescription="The current product has no applicant storage, team workspace, document access, or AI processing. These safeguards need to be agreed and implemented before using real applicant records."
    >
      <p className="article-callout">
        Please do not send passports, academic or financial documents, immigration histories, or
        case details through the pilot form or LinkedIn. Use fictional examples when discussing a
        workflow.
      </p>
      <section className={styles.section}>
        <h2>Pilot requests and accounts</h2>
        <p>
          The pilot form collects only your work email and organization. We use them to review your
          request and follow up about fit and access. The database also records submission time,
          review status, and review information. A request is separate from an account or an access
          grant.
        </p>
        <p>
          Invited sign-in uses Supabase Auth. Account and access records include the invited email
          and identifiers needed for authentication. Authentication uses browser cookies; no
          applicant case record is created by signing in.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Hosting, processing, and access</h2>
        <p>
          Vercel hosts the website and server endpoints. Supabase provides authentication and
          PostgreSQL storage for requests, grants, and throttling records. When analytics is
          configured, PostHog processes usage events. Visiting LinkedIn takes you to a separate
          service.
        </p>
        <p>
          The public site is served over HTTPS. The public database roles cannot read pilot requests
          or access grants. Admin review and invitation endpoints check the configured admin
          identity and verified authenticator MFA on the server. Authorized infrastructure operators
          can access the services they administer.
        </p>
        <p>
          These controls apply to the current enquiry and access flow. Applicant storage, team
          isolation, document access, and AI processing are not implemented. We have not published a
          verified region, encryption-at-rest, certification, or applicant-data compliance
          guarantee.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Analytics and request protection</h2>
        <p>
          When enabled, PostHog receives selected public pageviews and actions such as clicking a
          pilot link. Tracking can include browser identifiers and browser/device metadata. Verified
          invited users are identified by their account ID, without an email property.
        </p>
        <p>
          Our analytics events do not include form values, organization names, applicant details, or
          documents. URL query strings and fragments are removed from URL properties. Automatic
          click capture, session recordings, surveys, and error capture are disabled in the current
          implementation.
        </p>
        <p>
          To throttle public requests, the application stores a keyed hash derived from the client
          IP rather than the raw IP. Expired counters are eligible for cleanup after a day; cleanup
          runs during requests. Hosting and authentication providers may separately process
          operational logs.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Retention, deletion, and questions</h2>
        <p>
          Pilot and account records currently have no automatic deletion schedule. They remain until
          manually removed. No self-service deletion or export tool is available yet.
        </p>
        <p>
          For a correction, deletion request, or a suspected data-handling issue,{" "}
          <a
            className="text-link"
            href="https://www.linkedin.com/in/ankanganguly/"
            target="_blank"
            rel="noreferrer"
          >
            contact Ankan Ganguly on LinkedIn
          </a>
          . Start with a general request; do not send documents or credentials. We will agree an
          appropriate way to verify ownership. Removing an active record does not mean provider logs
          or backups are immediately erased.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Before any real applicant data is used</h2>
        <p>
          A real-data pilot must have written scope and data-handling arrangements before records
          are transferred. Those arrangements need to cover:
        </p>
        <ul>
          <li>
            Storage and processing locations, providers, and who can access each team’s records.
          </li>
          <li>
            Verified security controls, team isolation, and the incident contact and response
            process.
          </li>
          <li>
            Whether AI processes any information, which provider does so, and its retention and
            training terms.
          </li>
          <li>
            Retention periods, deletion and backup handling, and export and exit responsibilities.
          </li>
        </ul>
        <p>
          These are prerequisites to agree and implement, not controls we claim are already
          available. The first workflow discussion can use fictional data.
        </p>
      </section>
    </PilotArticleLayout>
  );
}
