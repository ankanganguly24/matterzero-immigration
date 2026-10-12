import type { Metadata } from "next";
import { currentCapabilities, sampleWorkflow } from "@/features/pilot/readiness-content";
import { PilotArticleLayout } from "@/features/pilot/pilot-article-layout";
import styles from "@/features/pilot/pilot-information.module.css";

export const metadata: Metadata = {
  title: "Sample workflow and current capabilities",
  description:
    "Explore a fictional student file and see what is available, discussed, and planned for MatterZero.",
  alternates: { canonical: "/workflow-preview" },
  openGraph: {
    title: "Sample workflow and current capabilities | MatterZero",
    description:
      "A clearly labelled design walkthrough using fictional data, with current product availability.",
    url: "/workflow-preview",
  },
};

export default function WorkflowPreviewPage() {
  return (
    <PilotArticleLayout
      eyebrow="Design walkthrough · fictional data"
      title="A student file, from intake to review."
      description="Follow the proposed steps a counsellor would take to find missing information, request a clearer document, and resolve a disagreement."
      sidebarTitle="Sample workflow"
      sidebarDescription="This walkthrough is an illustrative design, not a working applicant workspace. Student intake is one workflow to discuss, not a finalized product specialization."
    >
      <p className="article-callout">
        All details are fictional. The example checklist is chosen for the scenario, not a visa
        requirement list or a claim of support for a particular immigration route.
      </p>
      <h2 id="sample-heading">The proposed workflow</h2>
      <ol className={styles.workflowSteps}>
        {sampleWorkflow.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.situation}</p>
            <p>
              <strong>Proposed action:</strong> {step.action}
            </p>
          </li>
        ))}
      </ol>
      <section className={styles.section} id="capabilities" aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading">What works today</h2>
        <p>
          Available means released. Discussed means agreed in conversation. Planned means not
          released. On small screens, scroll the table to see all columns.
        </p>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label="Current capabilities table; scroll horizontally on smaller screens"
        >
          <table className={styles.table}>
            <caption>Current product capabilities</caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">Status</th>
                <th scope="col">What to expect and who does the work</th>
              </tr>
            </thead>
            <tbody>
              {currentCapabilities.map((item) => (
                <tr key={item.title}>
                  <th scope="row">{item.title}</th>
                  <td>
                    <span className={styles.badge}>{item.status}</span>
                  </td>
                  <td>
                    {item.detail}
                    <br />
                    <strong>Staff responsibility:</strong> {item.responsibility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Choose the first workflow together</h2>
        <p>
          Indian immigration consultancies are our initial audience. Student intake is one scenario
          to discuss, not a finalized product specialization. Our O-1A field notes describe a
          different preparation workflow; they do not establish support for student visa processing.
        </p>
        <p>
          Before building a pilot around your team, we need to understand where information arrives,
          who enters it, who follows up, and what professional review requires.
        </p>
      </section>
    </PilotArticleLayout>
  );
}
