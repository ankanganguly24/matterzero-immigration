import Link from "next/link";
import styles from "./workspace-pages.module.css";
import type { WorkspaceSummary } from "./workspace-shell";

export function WorkspaceOverview({ workspace }: { workspace: WorkspaceSummary }) {
  const sections = [
    { href: "matters", label: "Matters", description: "Applicant records and case progress." },
    { href: "collector", label: "Collector", description: "Requested and received evidence." },
    { href: "chronology", label: "Chronology", description: "Facts linked back to their sources." },
    { href: "review", label: "Review queue", description: "Conflicts and items needing a person." },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>WORKSPACE OVERVIEW</p>
          <h1>Matter overview</h1>
          <p>See the state of your team’s immigration work in one place.</p>
        </div>
        <span className={styles.privateTag}>Private workspace</span>
      </div>

      <section className={styles.metrics} aria-label="Matter overview">
        {[
          ["0", "Open matters"],
          ["0", "Evidence requests"],
          ["0", "Items to review"],
          ["0", "Ready for handoff"],
        ].map(([value, label]) => (
          <article className={styles.metricCard} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>No live case records yet</small>
          </article>
        ))}
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.sectionCard} aria-labelledby="operations-heading">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>OPERATIONS</p>
              <h2 id="operations-heading">Your team’s workflow</h2>
            </div>
            <span className={styles.emptyCount}>0 active</span>
          </div>
          <div className={styles.sectionLinks}>
            {sections.map((section, index) => (
              <Link
                href={`/dashboard/${workspace.id}/${section.href}`}
                className={styles.sectionLink}
                key={section.href}
              >
                <span className={styles.sectionIndex}>0{index + 1}</span>
                <span className={styles.sectionCopy}>
                  <strong>{section.label}</strong>
                  <small>{section.description}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className={styles.sampleCard}>
          <span className={styles.sampleBadge}>FICTIONAL SAMPLE</span>
          <h2>Explore the evidence workflow</h2>
          <p>
            Walk through an example intake, evidence request, source-linked chronology, and review.
            The sample is separate from your workspace records.
          </p>
          <Link href={`/dashboard/${workspace.id}/sample`} className={styles.sampleLink}>
            Open sample workflow <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>

      <p className={styles.disclaimer}>
        This workspace is ready for setup, but real applicant case management is still being built.
        Don’t upload applicant documents or enter sensitive case details yet.
      </p>
    </div>
  );
}

const sectionContent = {
  matters: {
    eyebrow: "CASE RECORDS",
    title: "Matters",
    description: "A matter will bring intake, evidence, source history, and review together.",
  },
  collector: {
    eyebrow: "EVIDENCE COLLECTION",
    title: "Collector",
    description: "Track evidence requests and what has arrived for each matter.",
  },
  chronology: {
    eyebrow: "SOURCE-LINKED FACTS",
    title: "Chronology",
    description: "Review dated events with the people and sources that support them.",
  },
  review: {
    eyebrow: "HUMAN REVIEW",
    title: "Review queue",
    description: "Find missing information, uncertain changes, and conflicting sources.",
  },
} as const;

export function WorkspaceSection({
  workspace,
  section,
}: {
  workspace: WorkspaceSummary;
  section: keyof typeof sectionContent;
}) {
  const content = sectionContent[section];
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </div>
      <section className={styles.emptyState}>
        <span className={styles.emptyIcon} aria-hidden="true">
          {section === "review"
            ? "✓"
            : section === "chronology"
              ? "◷"
              : section === "collector"
                ? "⇣"
                : "▤"}
        </span>
        <p className={styles.eyebrow}>NO LIVE MATTERS</p>
        <h2>This area is ready for your team’s work.</h2>
        <p>
          Real applicant workflows are not enabled yet. Use the fictional sample to explore the
          proposed interface without adding case data.
        </p>
        <Link href={`/dashboard/${workspace.id}/sample`} className={styles.sampleLink}>
          Open sample workflow <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
