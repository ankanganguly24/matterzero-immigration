import Link from "next/link";
import type { WorkspaceSummary } from "./workspace-shell";
import styles from "./workspace-pages.module.css";

const concepts = {
  rfe: {
    eyebrow: "ROADMAP CONCEPT · NOT LIVE",
    title: "RFE Defense Engine",
    description:
      "A proposed review workspace for organizing a notice, mapping each concern to available evidence, and preparing a response for professional review.",
    steps: [
      ["01", "Notice review", "Capture the notice date and separate its stated concerns."],
      ["02", "Evidence map", "Link each concern to supporting, missing, or conflicting sources."],
      ["03", "Response review", "Prepare a source-linked draft outline for attorney review."],
    ],
  },
  employer: {
    eyebrow: "ROADMAP CONCEPT · NOT LIVE",
    title: "Employer Compliance Audit",
    description:
      "A proposed workspace for tracking employer-file materials, important dates, and items that need a qualified person to review.",
    steps: [
      ["01", "File checklist", "Organize required records by employee and matter."],
      ["02", "Date review", "Surface upcoming dates and incomplete records for review."],
      ["03", "Audit packet", "Prepare a versioned packet for authorized professional review."],
    ],
  },
} as const;

export function WorkspaceConcept({
  workspace,
  workflow,
}: {
  workspace: WorkspaceSummary;
  workflow: keyof typeof concepts;
}) {
  const concept = concepts[workflow];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{concept.eyebrow}</p>
          <h1>{concept.title}</h1>
          <p>{concept.description}</p>
        </div>
        <span className={styles.privateTag}>Preview · Coming soon</span>
      </div>

      <section className={styles.emptyState} aria-labelledby="concept-state-heading">
        <span className={styles.sampleBadge}>ROADMAP PREVIEW</span>
        <h2 id="concept-state-heading">This workflow is not connected to live case data.</h2>
        <p>
          This preview describes a future workflow only. No applicant records, documents, legal
          analysis, or compliance decisions are created here.
        </p>
        <div className={styles.sectionLinks}>
          {concept.steps.map(([number, title, description]) => (
            <div className={styles.sectionLink} key={number}>
              <span className={styles.sectionIndex}>{number}</span>
              <span className={styles.sectionCopy}>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </div>
          ))}
        </div>
        <Link href={`/dashboard/${workspace.id}/sample`} className={styles.sampleLink}>
          Explore the fictional evidence sample <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
