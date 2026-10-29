import Link from "next/link";
import type { MatterStatus } from "@/lib/db/schema";
import { WorkspaceIcon } from "./workspace-icon";
import styles from "./workspace-pages.module.css";
import type { WorkspaceSummary } from "./workspace-shell";

type OverviewData = {
  counts: Record<MatterStatus, number>;
  recentMatters: {
    id: string;
    firstName: string;
    lastName: string;
    petitionType: string;
    status: MatterStatus;
    updatedAt: string;
  }[];
};

const statusLabels: Record<MatterStatus, string> = {
  intake: "Intake",
  parsing: "Parsing",
  conflict_flagged: "Needs review",
  ready_for_export: "Ready for export",
};

function MetricCard({
  label,
  count,
  caption,
  icon,
  tone,
}: {
  label: string;
  count: number | null;
  caption: string;
  icon: "matters" | "file" | "overview" | "arrow";
  tone: "forest" | "blue" | "amber" | "lime";
}) {
  return (
    <article className={`${styles.metricCard} ${styles[`metric_${tone}`]}`}>
      <div className={styles.metricTop}>
        <span>{label}</span>
        <span className={styles.metricIcon}>
          <WorkspaceIcon name={icon} size={18} />
        </span>
      </div>
      <strong>{count === null ? "—" : count}</strong>
      <small>{count === null ? "Unable to load this workspace metric" : caption}</small>
    </article>
  );
}

export function WorkspaceOverview({
  workspace,
  overviewData,
}: {
  workspace: WorkspaceSummary;
  overviewData: OverviewData | null;
}) {
  const counts = overviewData?.counts;
  const openCount = counts
    ? Object.values(counts).reduce((total, value) => total + value, 0)
    : null;
  const metrics = [
    {
      label: "Open matters",
      count: openCount,
      caption: openCount === 0 ? "No live matters yet" : "Across this workspace",
      icon: "matters" as const,
      tone: "forest" as const,
    },
    {
      label: "In intake",
      count: counts?.intake ?? null,
      caption: "Records awaiting casework",
      icon: "file" as const,
      tone: "blue" as const,
    },
    {
      label: "Needs review",
      count: counts ? counts.conflict_flagged : null,
      caption: "Flagged for a person to review",
      icon: "overview" as const,
      tone: "amber" as const,
    },
    {
      label: "Ready for export",
      count: counts?.ready_for_export ?? null,
      caption: "Matter records in this state",
      icon: "arrow" as const,
      tone: "lime" as const,
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.overviewHero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>WORKSPACE OVERVIEW</p>
          <h1>Good work starts with a clear matter record.</h1>
          <p>
            Welcome to <strong>{workspace.name}</strong>. Track active matters, see what needs
            attention, and move new work into the right place.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link
            href={`/dashboard/${workspace.id}/matters?create=1`}
            className={styles.primaryAction}
          >
            <span>+ Add a matter</span>
          </Link>
          <Link
            href={`/dashboard/${workspace.id}/matters?import=1`}
            className={styles.secondaryAction}
          >
            <WorkspaceIcon name="ingestion" size={17} />
            <span>Import from CSV</span>
          </Link>
        </div>
        <div className={styles.heroDecoration} aria-hidden="true">
          <div className={styles.heroDocument}>
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className={styles.heroCheck}>✓</div>
        </div>
      </section>

      <section className={styles.metrics} aria-label="Workspace matter metrics">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <div className={styles.overviewGrid}>
        <section className={styles.recentCard} aria-labelledby="recent-heading">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>WORKSPACE ACTIVITY</p>
              <h2 id="recent-heading">Recent matters</h2>
            </div>
            <Link href={`/dashboard/${workspace.id}/matters`} className={styles.textAction}>
              View all <WorkspaceIcon name="arrow" size={15} />
            </Link>
          </div>
          {!overviewData ? (
            <div className={styles.recentEmpty}>
              <span className={styles.emptySymbol}>!</span>
              <strong>Workspace activity is unavailable</strong>
              <p>Refresh this page in a moment. Your matter records have not been changed.</p>
            </div>
          ) : overviewData.recentMatters.length === 0 ? (
            <div className={styles.recentEmpty}>
              <span className={styles.emptySymbol}>
                <WorkspaceIcon name="matters" size={21} />
              </span>
              <strong>Your workspace is ready for its first matter</strong>
              <p>Create a single matter or import a reviewed CSV list to get started.</p>
              <div className={styles.emptyActions}>
                <Link
                  href={`/dashboard/${workspace.id}/matters?create=1`}
                  className={styles.primaryAction}
                >
                  Create first matter
                </Link>
                <Link
                  href={`/dashboard/${workspace.id}/matters?import=1`}
                  className={styles.textAction}
                >
                  Import multiple <WorkspaceIcon name="arrow" size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.recentList}>
              {overviewData.recentMatters.map((matter) => (
                <Link
                  href={`/dashboard/${workspace.id}/matters`}
                  className={styles.recentRow}
                  key={matter.id}
                >
                  <span className={styles.applicantMark} aria-hidden="true">
                    {matter.firstName.charAt(0)}
                    {matter.lastName.charAt(0)}
                  </span>
                  <span className={styles.applicantInfo}>
                    <strong>
                      {matter.firstName} {matter.lastName}
                    </strong>
                    <small>{matter.petitionType} petition</small>
                  </span>
                  <span className={`${styles.statusPill} ${styles[`status_${matter.status}`]}`}>
                    {statusLabels[matter.status]}
                  </span>
                  <span className={styles.rowDate}>
                    {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
                      new Date(matter.updatedAt),
                    )}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className={styles.overviewAside}>
          <section className={styles.sampleCard}>
            <div className={styles.sampleArt} aria-hidden="true">
              <span className={styles.sampleArtSheet}>
                <i />
                <i />
                <i />
                <b>O-1A</b>
              </span>
              <span className={styles.sampleArtPin}>✓</span>
            </div>
            <span className={styles.sampleBadge}>FICTIONAL WALKTHROUGH</span>
            <h2>See the workflow in action</h2>
            <p>
              Explore a fictional petition with example intake, evidence, chronology, and review.
            </p>
            <Link href={`/dashboard/${workspace.id}/sample`} className={styles.sampleAction}>
              Open sample case <WorkspaceIcon name="arrow" size={16} />
            </Link>
          </section>
          <p className={styles.privacyNote}>
            <span aria-hidden="true">◈</span>
            <span>
              <strong>Keep applicant data out for now</strong>
              Document ingestion and evidence review are still in development.
            </span>
          </p>
        </aside>
      </div>
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
