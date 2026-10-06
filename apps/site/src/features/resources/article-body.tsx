import Link from "next/link";

export function ArticleBody({ slug }: { slug: string }) {
  if (slug === "organize-before-o1a-consultation") return <O1AArticle />;
  if (slug === "document-requests-applicants-can-follow") return <DocumentRequestsArticle />;
  if (slug === "build-a-clear-employment-timeline") return <TimelineArticle />;
  return null;
}

function O1AArticle() {
  return (
    <>
      <p className="article-callout">
        This is an organization guide for a conversation with counsel. It is not a way to determine
        whether an applicant qualifies, and it is not legal advice.
      </p>
      <p>
        Preparing for an O-1A consultation can feel like preparing to prove everything at once. A
        more useful first step is to build a navigable story: what work the person has done, what
        evidence exists, and where each piece came from. Counsel can then decide which legal
        questions matter and how to evaluate the record.
      </p>
      <h2>Start with a simple professional timeline</h2>
      <p>
        List roles, employers, dates, major projects, publications, awards, speaking engagements,
        and review or judging work. For each entry, write down the source you have: a CV, contract,
        employer letter, program page, article, certificate, or personal notes. Mark the date as
        approximate if it is approximate.
      </p>
      <p>
        This prevents a common intake problem: the same role appears under different dates in the
        applicant’s memory, résumé, and employer paperwork. The difference might have a simple
        explanation, but the reviewer should see it rather than silently choose one value.
      </p>
      <h2>Group documents around claims</h2>
      <p>
        Instead of sending a folder called “O-1 documents,” create a short index. Example: “I
        authored these papers” linked to a publication list and copies; “I reviewed other
        researchers’ work” linked to invitations or confirmations; “I held this role” linked to
        employer records. Keep the original files and note page numbers where the relevant detail
        appears.
      </p>
      <ul>
        <li>Use clear file names with dates and document type.</li>
        <li>Keep full documents where completeness matters; do not crop away context.</li>
        <li>Label translations and identify the original-language document.</li>
        <li>Separate verified records from recollections and items still being requested.</li>
      </ul>
      <h2>Use the official criteria as a discussion map</h2>
      <p>
        USCIS describes O-1A extraordinary ability in fields including science, education, business,
        and athletics. Its policy manual discusses the evidentiary framework and how officers review
        evidence. Read the{" "}
        <a
          href="https://www.uscis.gov/policy-manual/volume-2-part-m-chapter-4"
          target="_blank"
          rel="noreferrer"
        >
          USCIS Policy Manual, Volume 2, Part M, Chapter 4
        </a>{" "}
        with counsel if it is relevant to your situation. A list of documents is not a legal
        assessment, and a document does not establish that a criterion is met by itself.
      </p>
      <h2>Bring questions, not conclusions</h2>
      <p>
        Useful questions include: Which dates need confirmation? Which documents are incomplete? Are
        there materials the attorney wants before evaluating a particular claim? What should remain
        confidential or be shared only through the firm’s approved channel?
      </p>
      <p>
        A clear evidence index helps the consultation start with the facts. The attorney remains
        responsible for legal analysis, strategy, and advice.
      </p>
      <p className="article-source">
        <strong>Primary source:</strong>{" "}
        <a
          href="https://www.uscis.gov/policy-manual/volume-2-part-m-chapter-4"
          target="_blank"
          rel="noreferrer"
        >
          USCIS Policy Manual: O-1 Beneficiaries
        </a>
        . Immigration rules and agency guidance can change; check official sources and consult a
        qualified immigration professional.
      </p>
      <RelatedArticles current="organize-before-o1a-consultation" />
    </>
  );
}

function DocumentRequestsArticle() {
  return (
    <>
      <p className="article-callout">
        A good request reduces back-and-forth. It does not need to sound automated or legalistic.
      </p>
      <p>
        “Please send your documents” makes the applicant do the work of figuring out what the team
        needs. A strong request names the item, explains what makes a usable copy, tells the
        applicant how to send it, and gives a simple way to ask for help.
      </p>
      <h2>Use one request per clear action</h2>
      <p>
        Group related files when that helps, but avoid a long paragraph with ten different
        requirements. Make each item scannable. If the request is for a complete passport copy, say
        which pages are expected. If the team needs all pages of a statement, say that directly.
        Keep instructions aligned with the firm’s approved process.
      </p>
      <div className="example-request">
        <span className="example-request__label">A clearer request</span>
        <p>
          <strong>Employment letter</strong>
          <br />
          Please upload the signed employment letter as a PDF or clear photo. We need the pages that
          show your role and employment dates. If you do not have this letter yet, choose “I need
          help getting it” and we’ll note that for the team.
        </p>
      </div>
      <h2>Explain the next step</h2>
      <p>
        Applicants are more likely to respond when they understand what will happen after they
        upload a file. Tell them that a team member will review it, and that you may ask for a
        clearer or more complete copy. Avoid implying that the upload alone proves eligibility or
        guarantees a result.
      </p>
      <h2>Track request state, not just message history</h2>
      <p>
        For each checklist item, keep a state such as missing, requested, received, under review,
        accepted, or resubmission needed. Record when the request was sent and whether it was
        delivered. When a file arrives, cancel any reminder that is no longer relevant. A generic
        reminder sent after an upload makes the service feel inattentive.
      </p>
      <ul>
        <li>Assign an owner for unusual or overdue items.</li>
        <li>Use a reasonable reminder cadence and respect channel preferences.</li>
        <li>Provide a secure upload route and a contact option for accessibility needs.</li>
        <li>Keep the original request and every later change in the case history.</li>
      </ul>
      <h2>Make the team’s language consistent</h2>
      <p>
        Use a shared request template, then personalize the item name, quality issue, and due date.
        Avoid unexplained acronyms. If the applicant prefers another language, use reviewed
        translations and retain the English field labels your internal reviewers need.
      </p>
      <p className="article-source">
        This article describes operational communication practices, not legal document requirements.
        The firm or attorney should set the actual case checklist.
      </p>
      <RelatedArticles current="document-requests-applicants-can-follow" />
    </>
  );
}

function TimelineArticle() {
  return (
    <>
      <p className="article-callout">
        The point of a timeline is to make sources and uncertainty visible—not to force every date
        into a single answer too early.
      </p>
      <p>
        Employment dates often arrive in different formats. An applicant may remember “March 2023,”
        a CV may list “April 2023,” and an employer letter may give a specific day. A reviewer needs
        to see both the values and the records behind them.
      </p>
      <h2>Capture the source before normalizing the value</h2>
      <p>
        For each date, save the original wording, source type, file version, page or transcript
        time, and how precise the date is. Keep “March 2023” as month precision; do not turn it into
        March 1. Store a full date only when a source actually gives one.
      </p>
      <h2>Compare like with like</h2>
      <p>
        Normalize formats for comparison, but preserve the original text. “Mar 2023” and “March 27,
        2023” may be compatible because one is less precise. “April 2023” and “March 27, 2023”
        deserve a review question. The system should explain the difference and let a person decide
        whether it reflects rounding, a start-date convention, or an error.
      </p>
      <div
        className="timeline-table"
        role="table"
        aria-label="Example source comparison for an employment start date"
      >
        <div role="row" className="timeline-table__head">
          <span role="columnheader">Source</span>
          <span role="columnheader">Reported date</span>
          <span role="columnheader">Precision</span>
        </div>
        <div role="row">
          <span role="cell">Applicant conversation</span>
          <span role="cell">March 2023</span>
          <span role="cell">Month</span>
        </div>
        <div role="row">
          <span role="cell">CV, page 2</span>
          <span role="cell">April 2023</span>
          <span role="cell">Month</span>
        </div>
        <div role="row">
          <span role="cell">Employer letter, page 1</span>
          <span role="cell">27 March 2023</span>
          <span role="cell">Day</span>
        </div>
      </div>
      <h2>Resolve with a question and a record</h2>
      <p>
        Ask the applicant or case owner to clarify the date convention. Record the answer, who
        confirmed it, when, and which source supports the decision. Keep the earlier statements
        visible in history. If the evidence remains unclear, label the field unresolved instead of
        choosing a convenient value.
      </p>
      <h2>Why this helps the handoff</h2>
      <p>
        A source-linked timeline lets a reviewer scan career progression without reopening every
        attachment. It also makes it easier to spot gaps in coverage, confirm which documents still
        need to arrive, and direct a specific follow-up to the right person.
      </p>
      <p className="article-source">
        For immigration matters, the legal significance of a work period depends on the particular
        case and applicable rules. Ask the responsible immigration professional to interpret it.
      </p>
      <RelatedArticles current="build-a-clear-employment-timeline" />
    </>
  );
}

function RelatedArticles({ current }: { current: string }) {
  const related = [
    { slug: "organize-before-o1a-consultation", title: "Organize before an O-1A consultation" },
    { slug: "document-requests-applicants-can-follow", title: "Write clearer document requests" },
    { slug: "build-a-clear-employment-timeline", title: "Build a source-linked timeline" },
  ].filter((item) => item.slug !== current);
  return (
    <aside className="related-articles">
      <h2>Continue reading</h2>
      {related.map((item) => (
        <Link key={item.slug} href={`/resources/${item.slug}`}>
          {item.title} <span aria-hidden="true">→</span>
        </Link>
      ))}
    </aside>
  );
}
