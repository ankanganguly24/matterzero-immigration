"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { demoMatter, sources, timeline, type SourceCitation, type SourceId } from "./demo-fixture";
import styles from "./workspace.module.css";

type WorkspaceTab = "intake" | "collector" | "chronology" | "review" | "rfe" | "employer";

const tabs: { id: WorkspaceTab; label: string; number?: string }[] = [
  { id: "intake", label: "Intake", number: "01" },
  { id: "collector", label: "Collector", number: "02" },
  { id: "chronology", label: "Chronology", number: "03" },
  { id: "review", label: "Review", number: "04" },
  { id: "rfe", label: "RFE concept" },
  { id: "employer", label: "Employer concept" },
];

export function EvidenceWorkspace({ versionHash }: { versionHash: string }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("intake");
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation>(
    timeline[0].citations[0],
  );
  const [received, setReceived] = useState(false);
  const [approvalState, setApprovalState] = useState<"idle" | "saving" | "approved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function selectSource(source: SourceId) {
    const citation = timeline
      .flatMap((item) => item.citations)
      .find((item) => item.source === source);
    if (citation) setSelectedCitation(citation);
  }

  useEffect(() => {
    let active = true;
    void fetch(`/api/demo/approvals?matterId=${encodeURIComponent(demoMatter.id)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { approved: boolean };
      })
      .then((result) => {
        if (active && result?.approved) setApprovalState("approved");
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  async function approveVersion() {
    setApprovalState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/demo/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matterId: demoMatter.id, versionHash }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Approval could not be saved.");
      setApprovalState("approved");
      setMessage("This sample version is approved. The approval is recorded server-side.");
    } catch (error) {
      setApprovalState("error");
      setMessage(error instanceof Error ? error.message : "Approval could not be saved.");
    }
  }

  async function requestExport() {
    setMessage("");
    try {
      const response = await fetch(
        `/api/demo/export?matterId=${encodeURIComponent(demoMatter.id)}`,
      );
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Export is not available.");
      }
      const exportData = (await response.json()) as { downloadName: string; payload: object };
      const blob = new Blob([JSON.stringify(exportData.payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = exportData.downloadName;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Approved sample export downloaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export is not available.");
    }
  }

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidebar} aria-label="MatterZero workspace navigation">
        <Link className={styles.brand} href="/" aria-label="MatterZero home">
          <span className={styles.brandMark}>M</span>
          <span>MatterZero</span>
        </Link>
        <div className={styles.workspaceSwitcher}>
          <span className={styles.switcherLabel}>DEMO WORKSPACE</span>
          <strong>Evidence review</strong>
          <span className={styles.switcherCaret}>⌄</span>
        </div>
        <p className={styles.navLabel}>WORKSPACE</p>
        <button
          className={`${styles.navItem} ${activeTab === "intake" ? styles.navActive : ""}`}
          onClick={() => setActiveTab("intake")}
        >
          <span aria-hidden="true">▦</span> Matter overview
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "collector" ? styles.navActive : ""}`}
          onClick={() => setActiveTab("collector")}
        >
          <span aria-hidden="true">⇣</span> Collector <span className={styles.navCount}>2</span>
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "chronology" ? styles.navActive : ""}`}
          onClick={() => setActiveTab("chronology")}
        >
          <span aria-hidden="true">◷</span> Chronology
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "review" ? styles.navActive : ""}`}
          onClick={() => setActiveTab("review")}
        >
          <span aria-hidden="true">✓</span> Review queue
        </button>
        <div className={styles.sidebarBottom}>
          <span className={styles.avatar}>DR</span>
          <span>
            <strong>Demo reviewer</strong>
            <small>Sample account</small>
          </span>
          <span className={styles.more}>···</span>
        </div>
      </aside>

      <section className={styles.contentShell}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}>
            Matters <span>/</span> <strong>{demoMatter.title}</strong>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.demoPill}>
              <i /> FICTIONAL DEMO
            </span>
            <button className={styles.helpButton} aria-label="Help">
              ?
            </button>
            <span className={styles.avatar}>DR</span>
          </div>
        </header>

        <div className={styles.pageContent}>
          <div className={styles.pageIntro}>
            <div>
              <p className={styles.kicker}>
                {demoMatter.id.toUpperCase()} <span>·</span> SAMPLE DATA
              </p>
              <h1>{demoMatter.title}</h1>
              <p className={styles.subhead}>
                {demoMatter.caseType} · a source-led evidence workflow for an immigration team.
              </p>
            </div>
            <button className={styles.outlineButton} onClick={() => setActiveTab("review")}>
              Review status <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className={styles.disclaimer}>
            <span aria-hidden="true">ⓘ</span>
            <p>
              <strong>Fictional case for product demonstration.</strong> This workspace contains
              sample documents and facts. It is not a live case file, legal checklist, or
              immigration advice.
            </p>
          </div>

          <nav className={styles.workflowNav} aria-label="Demo workflow">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.workflowTab} ${activeTab === tab.id ? styles.workflowTabActive : ""} ${!tab.number ? styles.conceptTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "step" : undefined}
              >
                {tab.number && <span>{tab.number}</span>}
                {tab.label}
                {!tab.number && <small>CONCEPT</small>}
              </button>
            ))}
          </nav>

          {activeTab === "intake" && <IntakeView onSelectSource={selectSource} />}
          {activeTab === "collector" && (
            <CollectorView
              received={received}
              onReceive={() => setReceived(true)}
              onSelectSource={selectSource}
            />
          )}
          {activeTab === "chronology" && (
            <ChronologyView
              selectedCitation={selectedCitation}
              onSelectCitation={setSelectedCitation}
            />
          )}
          {activeTab === "review" && (
            <ReviewView
              versionHash={versionHash}
              approvalState={approvalState}
              onApprove={approveVersion}
              onExport={requestExport}
            />
          )}
          {activeTab === "rfe" && (
            <ConceptView
              title="RFE response preparation"
              label="CONCEPT PREVIEW"
              description="Extract the concerns stated in a sample notice and surface linked evidence for counsel to assess."
              steps={[
                "Notice text and printed deadline",
                "Candidate evidence with source links",
                "Counsel review of strategy and response",
              ]}
            />
          )}
          {activeTab === "employer" && (
            <ConceptView
              title="Employer record organization"
              label="CONCEPT PREVIEW"
              description="Organize employer records and firm-defined review items for H-1B and PERM workflows."
              steps={[
                "Employer file checklist",
                "Source-backed dates and records",
                "Reviewer-controlled audit packet",
              ]}
            />
          )}
          {message && (
            <p className={styles.liveMessage} role="status">
              {message}
            </p>
          )}
          <footer className={styles.workspaceFooter}>
            MatterZero organizes source material for professional review. Legal interpretation and
            case decisions remain with the responsible professional.
          </footer>
        </div>
      </section>
    </div>
  );
}

function IntakeView({ onSelectSource }: { onSelectSource: (source: SourceId) => void }) {
  return (
    <div className={styles.viewGrid}>
      <section className={styles.panel}>
        <PanelHeading
          eyebrow="INTAKE SUMMARY"
          title="Client-provided information"
          note="Candidate details are reviewable and linked back to their source."
        />
        <div className={styles.personCard}>
          <span className={styles.personAvatar}>RS</span>
          <div>
            <strong>{demoMatter.applicant}</strong>
            <small>Applicant · fictional profile</small>
          </div>
          <span className={styles.reviewBadge}>Needs review</span>
        </div>
        <dl className={styles.factList}>
          <div>
            <dt>Professional field</dt>
            <dd>Applied research</dd>
          </div>
          <div>
            <dt>Current organization</dt>
            <dd>
              Northstar Research Lab{" "}
              <span className={styles.sourceTag}>Employer letter · p. 1</span>
            </dd>
          </div>
          <div>
            <dt>Conference presentation</dt>
            <dd>
              May 2024{" "}
              <button className={styles.inlineSource} onClick={() => onSelectSource("intake")}>
                View source ↗
              </button>
            </dd>
          </div>
          <div>
            <dt>Open question</dt>
            <dd>Confirm conference date with invitation</dd>
          </div>
        </dl>
        <div className={styles.noteCard}>
          <span className={styles.noteIcon}>↗</span>
          <p>
            <strong>Source statement</strong>
            <br />
            “I presented the work at the annual research meeting in May 2024.”
          </p>
        </div>
      </section>
      <aside className={styles.panel}>
        <PanelHeading
          eyebrow="CASE SETUP"
          title="Matter checklist"
          note="Defined by the sample team for this demonstration."
        />
        <ChecklistRow
          state="done"
          title="Initial intake received"
          detail="Client questionnaire · 12 May"
        />
        <ChecklistRow
          state="done"
          title="Conference invitation"
          detail="Compare date in chronology"
        />
        <ChecklistRow state="waiting" title="Confirm event date" detail="Clarification requested" />
        <ChecklistRow state="waiting" title="Reviewer source check" detail="2 candidate events" />
        <div className={styles.panelFootnote}>
          No statutory eligibility rules are evaluated in this demo.
        </div>
      </aside>
    </div>
  );
}

function CollectorView({
  received,
  onReceive,
  onSelectSource,
}: {
  received: boolean;
  onReceive: () => void;
  onSelectSource: (source: SourceId) => void;
}) {
  return (
    <div className={styles.viewGrid}>
      <section className={styles.panel}>
        <PanelHeading
          eyebrow="COLLECTOR · SAMPLE REQUEST"
          title="Conference details"
          note="A scoped request with a clear purpose and source history."
        />
        <div className={styles.requestCard}>
          <div className={styles.requestHeader}>
            <span className={styles.requestIcon}>↗</span>
            <div>
              <strong>Confirm the presentation date</strong>
              <small>Purpose: reconcile dates across the intake and invitation</small>
            </div>
            <span
              className={`${styles.statusPill} ${received ? styles.statusComplete : styles.statusOpen}`}
            >
              {received ? "RECEIVED" : "OPEN"}
            </span>
          </div>
          <div className={styles.requestMeta}>
            <span>
              Requested from <b>{demoMatter.applicant}</b>
            </span>
            <span>
              Created <b>12 May 2026</b>
            </span>
            <span>
              Accepted formats <b>PDF, JPG</b>
            </span>
          </div>
          {received ? (
            <button className={styles.secondaryAction} onClick={() => onSelectSource("invitation")}>
              Open received invitation <span aria-hidden="true">↗</span>
            </button>
          ) : (
            <button className={styles.primaryAction} onClick={onReceive}>
              Simulate invitation received <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
        <div className={styles.activityList}>
          <h3>Request activity</h3>
          <p>
            <span className={styles.activityDot} /> Request created <time>12 May · 10:22</time>
          </p>
          {received && (
            <p>
              <span className={`${styles.activityDot} ${styles.activityDotDone}`} /> Sample
              invitation received <time>14 May · 16:05</time>
            </p>
          )}
        </div>
      </section>
      <aside className={styles.panel}>
        <PanelHeading eyebrow="REQUEST SCOPE" title="What this asks for" />
        <div className={styles.scopeItem}>
          <span>01</span>
          <p>
            <strong>One clarification</strong>
            <small>Confirm the date of the presentation</small>
          </p>
        </div>
        <div className={styles.scopeItem}>
          <span>02</span>
          <p>
            <strong>One supporting source</strong>
            <small>Invitation or event confirmation</small>
          </p>
        </div>
        <div className={styles.scopeItem}>
          <span>03</span>
          <p>
            <strong>Human follow-up</strong>
            <small>Reviewer compares it with the original intake statement</small>
          </p>
        </div>
        <div className={styles.sampleCallout}>
          This button changes sample interface state only. It does not send a real request or upload
          a file.
        </div>
      </aside>
    </div>
  );
}

function ChronologyView({
  selectedCitation,
  onSelectCitation,
}: {
  selectedCitation: SourceCitation;
  onSelectCitation: (citation: SourceCitation) => void;
}) {
  return (
    <div className={styles.chronologyLayout}>
      <section className={styles.panel}>
        <PanelHeading
          eyebrow="CHRONOLOGY · DRAFT 03"
          title="Events from the record"
          note="Select a row to inspect its source. Dates and conflicts remain visible for review."
        />
        <div className={styles.timeline}>
          {timeline.map((item) => (
            <article key={item.id} className={styles.timelineItem}>
              <span className={styles.timelineRail}>
                <i />
              </span>
              <span className={styles.timelineBody}>
                <span className={styles.timelineTop}>
                  <time>{item.date}</time>
                  <span className={styles.reviewBadge}>{item.status}</span>
                </span>
                <strong>{item.title}</strong>
                <span className={styles.timelineCitations}>
                  {item.citations.map((citation) => (
                    <button
                      key={`${citation.source}-${citation.location}`}
                      className={`${styles.citationButton} ${selectedCitation === citation ? styles.citationSelected : ""}`}
                      onClick={() => onSelectCitation(citation)}
                      aria-pressed={selectedCitation === citation}
                    >
                      <span className={styles.timelineQuote}>“{citation.quote}”</span>
                      <span className={styles.timelineSource}>
                        {sources[citation.source].title} · {citation.location}{" "}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </button>
                  ))}
                </span>
              </span>
            </article>
          ))}
        </div>
      </section>
      <SourcePanel citation={selectedCitation} />
    </div>
  );
}

function SourcePanel({ citation }: { citation: SourceCitation }) {
  const { source } = citation;
  const item = sources[source];
  return (
    <aside className={styles.sourcePanel}>
      <div className={styles.sourceHeader}>
        <span className={styles.sourceFileIcon}>{source === "intake" ? "NOTE" : "PDF"}</span>
        <span>
          <strong>{item.title}</strong>
          <small>
            {item.kind} · {item.date}
          </small>
        </span>
        <button aria-label="More source actions">···</button>
      </div>
      <div className={styles.documentCanvas}>
        <div className={styles.documentPage}>
          <p className={styles.docLetterhead}>
            {source === "employer-letter"
              ? "NORTHSTAR RESEARCH LAB"
              : source === "invitation"
                ? "RESEARCH MEETING · INVITATION"
                : "CLIENT INTAKE · NOTES"}
          </p>
          <p className={styles.docLine}>
            {source === "intake" ? "Applicant statement:" : "Dear Ria,"}
          </p>
          <p className={`${styles.docHighlight} ${styles.docHighlightOne}`}>{citation.quote}</p>
          <p className={styles.docLine}>
            {source === "employer-letter"
              ? "The information is provided for review against the source record."
              : "Please retain this message with the case record."}
          </p>
          <p className={styles.docSignature}>
            {source === "intake"
              ? `${demoMatter.applicant} · Client intake`
              : source === "invitation"
                ? "Conference Secretariat"
                : "People Operations"}
          </p>
          <span className={styles.boundingBoxLabel}>SOURCE SPAN · {item.page.toUpperCase()}</span>
        </div>
      </div>
      <div className={styles.sourceDetail}>
        <span className={styles.sourceDetailIcon}>⌖</span>
        <p>
          <strong>Selected source location</strong>
          <small>
            {item.title} · {citation.location}
          </small>
        </p>
      </div>
      <p className={styles.sourceExplanation}>{citation.detail}</p>
      <p className={styles.samplePageNote}>Illustrative source page · fictional text</p>
    </aside>
  );
}

function ReviewView({
  versionHash,
  approvalState,
  onApprove,
  onExport,
}: {
  versionHash: string;
  approvalState: "idle" | "saving" | "approved" | "error";
  onApprove: () => void;
  onExport: () => void;
}) {
  return (
    <div className={styles.viewGrid}>
      <section className={styles.panel}>
        <PanelHeading
          eyebrow="REVIEW GATE"
          title="Approve a specific sample version"
          note="Approval binds to a server-computed snapshot hash and requires the configured admin account with MFA."
        />
        <div className={styles.approvalCard}>
          <div className={styles.approvalTop}>
            <span
              className={`${styles.approvalIcon} ${approvalState === "approved" ? styles.approvalIconDone : ""}`}
            >
              {approvalState === "approved" ? "✓" : "4"}
            </span>
            <span>
              <strong>
                {approvalState === "approved"
                  ? "Sample version approved"
                  : "Reviewer sign-off pending"}
              </strong>
              <small>
                {approvalState === "approved"
                  ? "Approval stored for this exact version"
                  : "Review conflicts and source locations before approval"}
              </small>
            </span>
            <span className={styles.statusPill}>
              {approvalState === "approved" ? "APPROVED" : "PENDING"}
            </span>
          </div>
          <div className={styles.versionHash}>
            <span>VERSION HASH</span>
            <code>
              {versionHash.slice(0, 20)}…{versionHash.slice(-8)}
            </code>
          </div>
          <div className={styles.approvalActions}>
            <button
              className={styles.primaryAction}
              disabled={approvalState === "saving" || approvalState === "approved"}
              onClick={onApprove}
            >
              {approvalState === "saving"
                ? "Recording approval…"
                : approvalState === "approved"
                  ? "Version approved"
                  : "Approve sample version"}
            </button>
            <button className={styles.secondaryAction} onClick={onExport}>
              Download approved export
            </button>
          </div>
        </div>
        <div className={styles.reviewBoundary}>
          <span>ⓘ</span>
          <p>
            <strong>Demo boundary</strong>
            <br />
            This approval applies only to fictional sample data. It does not authorize or submit an
            immigration filing.
          </p>
        </div>
      </section>
      <aside className={styles.panel}>
        <PanelHeading eyebrow="REVIEW CHECKS" title="What the reviewer sees" />
        <ChecklistRow
          state="done"
          title="Source locations resolve"
          detail="Sample page references are present"
        />
        <ChecklistRow
          state="attention"
          title="Conference date conflict"
          detail="Intake says May; invitation says 14 June"
        />
        <ChecklistRow
          state="done"
          title="Case version identified"
          detail="Snapshot hash displayed above"
        />
        <div className={styles.panelFootnote}>
          Export endpoint independently checks the saved approval for this version.
        </div>
      </aside>
    </div>
  );
}

function ConceptView({
  title,
  label,
  description,
  steps,
}: {
  title: string;
  label: string;
  description: string;
  steps: string[];
}) {
  return (
    <section className={styles.conceptPanel}>
      <div className={styles.conceptMark}>MZ</div>
      <p className={styles.kicker}>{label}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <ol>
        {steps.map((step, index) => (
          <li key={step}>
            <span>0{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className={styles.conceptNotice}>Concept preview · Not available as a live workflow</div>
    </section>
  );
}

function PanelHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className={styles.panelHeading}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {note && <span>{note}</span>}
    </div>
  );
}

function ChecklistRow({
  state,
  title,
  detail,
}: {
  state: "done" | "waiting" | "attention";
  title: string;
  detail: string;
}) {
  return (
    <div className={styles.checklistRow}>
      <span className={`${styles.checklistIcon} ${styles[`checklistIcon_${state}`]}`}>
        {state === "done" ? "✓" : state === "attention" ? "!" : "·"}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}
