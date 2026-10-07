import Link from "next/link";

export function ArticleBody({ slug }: { slug: string }) {
  if (slug === "organize-before-o1a-consultation") return <O1AArticle />;
  if (slug === "document-requests-applicants-can-follow") return <DocumentRequestsArticle />;
  if (slug === "build-a-clear-employment-timeline") return <TimelineArticle />;
  if (slug === "immigration-document-checklist-follow-up-system") return <DocumentChasingArticle />;
  if (slug === "one-case-record-whatsapp-email-crm") return <CaseLedgerArticle />;
  if (slug === "immigration-case-file-readiness-review-checklist")
    return <ReadinessReviewArticle />;
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

function DocumentChasingArticle() {
  return (
    <>
      <p className="article-callout">
        <strong>Quick answer:</strong> A useful immigration document checklist names one item per
        row, explains what a usable copy means, gives it an owner and next date, and tracks it
        through review. Build it for the applicant’s case type and stage; no universal list fits
        every matter.
      </p>
      <p>
        “We are still waiting on documents” is not a workable status. A counselor needs to know
        which item is missing, who asked for it, what the applicant was told, and what should happen
        next. Without that context, a reminder can go out after the file has arrived—or a critical
        request can sit unnoticed in someone’s inbox.
      </p>

      <h2>Write each request so the applicant can act</h2>
      <p>
        A request should answer four questions: what do you need, what makes the copy usable, how
        should the applicant send it, and who can they contact if they cannot provide it? “Send your
        passport” leaves too much room for guesswork. A case-specific request might say which pages
        the team needs and where to upload them. The responsible professional should set the actual
        requirement.
      </p>
      <div className="example-request">
        <span className="example-request__label">A reusable request pattern</span>
        <p>
          <strong>[Document or information]</strong>
          <br />
          Please send [specific version, pages, date range, or format] through [approved secure
          channel] by [date]. We need it for [plain-language purpose]. If you do not have it or are
          unsure what to send, reply to [team contact] and we will record the next step.
        </p>
      </div>
      <p>
        Keep this as a writing pattern, not a legal checklist. For example, the U.S. Department of
        State’s immigrant visa interview instructions say applicants should bring original or
        certified copies of certain civil documents they uploaded to CEAC. That instruction is tied
        to that process and stage; it should not be copied as a rule for every immigration matter.
        See the current{" "}
        <a
          href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-10-prepare-for-the-interview/step-11-applicant-interview.html"
          target="_blank"
          rel="noreferrer"
        >
          Department of State interview guidance
        </a>
        .
      </p>

      <h2>Track the item, not just the message</h2>
      <p>
        Give every checklist item one current state, one owner, and a next action. Keep the request
        and response linked to it so a colleague can take over without reconstructing the
        conversation.
      </p>
      <ul>
        <li>
          <strong>Not requested:</strong> the case owner has not asked for it yet.
        </li>
        <li>
          <strong>Requested:</strong> the request was sent; save the channel and timestamp.
        </li>
        <li>
          <strong>Applicant needs help:</strong> someone must clarify the request or find another
          path.
        </li>
        <li>
          <strong>Received:</strong> a file or answer arrived; this does not mean it has been
          reviewed.
        </li>
        <li>
          <strong>Review in progress:</strong> the assigned reviewer is checking completeness and
          context.
        </li>
        <li>
          <strong>Follow-up needed:</strong> record the exact gap and the next request.
        </li>
        <li>
          <strong>Accepted for this checklist item:</strong> a team member confirmed it meets the
          firm’s operational request.
        </li>
      </ul>
      <p>
        Avoid a single “complete” checkbox. It hides whether the team received the file, checked the
        right pages, or decided no further action is needed. If a field is unresolved or
        conflicting, route it to a person for review using{" "}
        <Link href="/resources/immigration-case-file-readiness-review-checklist">
          this case-file readiness checklist
        </Link>
        .
      </p>

      <h2>Use a follow-up rhythm with a stop rule</h2>
      <p>
        Agree the reminder cadence with the applicant and the team. A simple operating pattern is:
        send the request, check that it reached the intended channel, send a polite reminder on the
        agreed date, then assign an owner if it remains outstanding. The right interval depends on
        the case timeline, urgency, channel preference, and firm policy; do not invent a deadline or
        imply that a missed internal date changes legal rights.
      </p>
      <ul>
        <li>Cancel or revise reminders as soon as the item arrives or the request changes.</li>
        <li>
          Pause automated chasing when the applicant says they need help, a translation, or more
          time.
        </li>
        <li>
          Record when a document arrives through a different channel and attach it to the same item.
        </li>
        <li>
          Escalate deadline-sensitive questions to the responsible professional instead of sending
          another generic nudge.
        </li>
      </ul>

      <h2>Keep the checklist case-specific</h2>
      <p>
        Start from the firm’s approved workflow and the current official instructions for the
        relevant process. USCIS form pages and individual form instructions can change and apply to
        particular filings. They are references for the responsible professional, not a substitute
        for their review. See{" "}
        <a
          href="https://www.uscis.gov/forms/filing-guidance/tips-for-filing-forms-by-mail"
          target="_blank"
          rel="noreferrer"
        >
          USCIS tips for filing forms by mail
        </a>
        .
      </p>
      <p>
        For a wider operational pattern, read{" "}
        <Link href="/resources/document-requests-applicants-can-follow">
          how to write document requests applicants can follow
        </Link>{" "}
        and{" "}
        <Link href="/resources/one-case-record-whatsapp-email-crm">
          how to keep WhatsApp, email, and CRM updates in one case record
        </Link>
        . MatterZero is being shaped around this kind of workflow;{" "}
        <Link href="/#pilot">discuss a one-workflow pilot</Link> to compare it with your team’s
        process.
      </p>
      <p className="article-source">
        <strong>Official references:</strong>{" "}
        <a
          href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-10-prepare-for-the-interview/step-11-applicant-interview.html"
          target="_blank"
          rel="noreferrer"
        >
          U.S. Department of State: applicant interview
        </a>
        {" · "}
        <a
          href="https://www.uscis.gov/forms/filing-guidance/tips-for-filing-forms-by-mail"
          target="_blank"
          rel="noreferrer"
        >
          USCIS: tips for filing forms by mail
        </a>
        . Requirements depend on the specific process and can change. This is operations guidance,
        not legal advice.
      </p>
      <RelatedArticles current="immigration-document-checklist-follow-up-system" />
    </>
  );
}

function CaseLedgerArticle() {
  return (
    <>
      <p className="article-callout">
        <strong>Quick answer:</strong> Pick the firm’s system of record, then capture each
        meaningful update there the same day with its source, timestamp, owner, and next action. If
        a new tool creates a second record that staff must reconcile later, the workflow has not
        solved the problem.
      </p>
      <p>
        An applicant sends a new employment date on WhatsApp. The CRM still has the old date. A
        teammate sees the email attachment but not the chat. The next person opens the case and has
        to decide which version to trust. The underlying problem is not the number of messages: it
        is that the case state was never updated where the team works.
      </p>

      <h2>Decide what “the case record” means</h2>
      <p>
        A case record is the place the team agrees to rely on for current status and next action. It
        may be the CRM, a case-management system, or—during an explicitly scoped pilot—a shared
        ledger connected to the firm’s existing process. Name it before automating anything. Also
        name which system remains authoritative for client identity, legal deadlines, and official
        agency notices.
      </p>
      <p>
        The agency record has its own authority. For example, USCIS explains that an online account
        can show case status, notices, and uploaded evidence for supported cases. A firm’s internal
        ledger should help staff organize their work; it should never be presented as an official
        government status source. See{" "}
        <a href="https://www.uscis.gov/file-online" target="_blank" rel="noreferrer">
          USCIS online filing and account guidance
        </a>
        .
      </p>

      <h2>Capture a small event when something changes</h2>
      <p>
        Treat updates as dated events rather than silently replacing a field. A useful entry can be
        short, but it should answer: what changed, who reported it, where it came from, when it was
        received, who recorded it, and what the team should do next.
      </p>
      <ul>
        <li>
          <strong>Case and item:</strong> identify the matter and the field or checklist item
          affected.
        </li>
        <li>
          <strong>Reported value:</strong> preserve the wording as received before normalizing it.
        </li>
        <li>
          <strong>Source:</strong> applicant, document, staff note, or official notice; include a
          secure link or page reference where appropriate.
        </li>
        <li>
          <strong>Received and recorded times:</strong> keep both if a later handoff caused a delay.
        </li>
        <li>
          <strong>Actor and action:</strong> who logged it, what they changed, and who owns the next
          step.
        </li>
        <li>
          <strong>Review state:</strong> unverified, confirmed, superseded, or needs clarification.
        </li>
      </ul>
      <p>
        A conversation transcript can help explain how an update arose, but it is not a case ledger.
        Save only the excerpt or document reference needed for the work, under the firm’s approved
        access and retention rules.{" "}
        <Link href="/resources/build-a-clear-employment-timeline">
          The same source-preserving approach works for dates that disagree across records.
        </Link>
      </p>

      <h2>Make “same day” a team habit</h2>
      <p>
        Set a service rule for the team: when an update changes a field, document state, or next
        action, the person who receives it records it before closing that task or hands it to a
        named owner. At the end of each workday, review the exceptions queue: updates received but
        not attached, documents without an owner, and conflicts awaiting clarification.
      </p>
      <div className="example-request">
        <span className="example-request__label">Example ledger entry</span>
        <p>
          <strong>Employment start date · Needs confirmation</strong>
          <br />
          Applicant reported “March 2023” in WhatsApp on 8 October. CV lists April 2023. Both source
          references saved. Owner: Priya. Next action: ask which date convention the employer letter
          uses; review due 10 October.
        </p>
      </div>
      <p>
        This entry keeps the conflict visible. It does not pick a legal answer, and it does not
        require staff to copy a whole chat into a second system. For a detailed comparison method,
        use{" "}
        <Link href="/resources/build-a-clear-employment-timeline">
          the source-linked timeline guide
        </Link>{" "}
        and the{" "}
        <Link href="/resources/immigration-case-file-readiness-review-checklist">
          case-file readiness checklist
        </Link>
        .
      </p>

      <h2>Connect different CRMs without promising magic</h2>
      <p>
        Firms use different systems, permissions, and data conventions. Start with the smallest
        reliable handoff the current stack supports: a documented manual entry, a reviewed CSV
        import/export, or an API connection after mapping and testing the fields. Keep a human owner
        for failed or ambiguous writes. Do not let a “sync succeeded” message hide an unmapped field
        or a duplicate case.
      </p>
      <p>
        Before a pilot, write down the case identifier, fields being exchanged, update direction,
        conflict rule, retry owner, and source of truth. MatterZero’s early pilot is intended to
        scope one repeatable workflow and its handoff with a team;{" "}
        <Link href="/#pilot">talk through a one-workflow pilot</Link> before expecting a connection
        to a particular CRM.
      </p>
      <p className="article-source">
        <strong>Official reference:</strong>{" "}
        <a href="https://www.uscis.gov/file-online" target="_blank" rel="noreferrer">
          USCIS: file online and manage supported cases
        </a>
        . Use the official source for government case information; this article describes internal
        team operations and does not give legal advice.
      </p>
      <RelatedArticles current="one-case-record-whatsapp-email-crm" />
    </>
  );
}

function ReadinessReviewArticle() {
  return (
    <>
      <p className="article-callout">
        <strong>Quick answer:</strong> Before professional review, show each requested item’s
        status, the source behind important facts, any conflicts or uncertainty, and the person who
        resolved them. “Ready” should mean operationally organized for review—not legally eligible
        or guaranteed to succeed.
      </p>
      <p>
        A folder can look full and still be hard to review. A document may be missing pages, a date
        may differ from the applicant’s account, or a translation may not be linked to its original.
        A readiness review makes those conditions visible before the handoff, so counsel can focus
        attention where judgment is needed.
      </p>

      <h2>Use separate states for receipt and review</h2>
      <p>
        Avoid treating “uploaded” as “complete.” Track the operational state of each request
        separately from the legal meaning of the evidence. A compact workflow might use:
      </p>
      <ul>
        <li>
          <strong>Not requested</strong> — the case owner has not initiated the request.
        </li>
        <li>
          <strong>Requested</strong> — instructions and an owner are recorded.
        </li>
        <li>
          <strong>Received</strong> — a file or answer is linked to the request.
        </li>
        <li>
          <strong>Review needed</strong> — a person must check completeness, legibility, or context.
        </li>
        <li>
          <strong>Follow-up needed</strong> — the reviewer recorded a specific gap and a new action.
        </li>
        <li>
          <strong>Organized for professional review</strong> — the assigned team member completed
          the agreed operational checks.
        </li>
      </ul>
      <p>
        The status describes work completed by the team. It does not say an item satisfies a
        statutory requirement. Requirements vary by form, category, and individual facts; use the
        current instructions for the relevant process. USCIS publishes checklists inside particular
        form instructions, such as{" "}
        <a
          href="https://www.uscis.gov/sites/default/files/document/forms/i-821instr.pdf"
          target="_blank"
          rel="noreferrer"
        >
          the Form I-821 instructions
        </a>
        . That checklist is specific to that form and edition.
      </p>

      <h2>Link every important field to its evidence</h2>
      <p>
        For fields such as names, dates, employers, addresses, and document validity dates, keep a
        source reference beside the current value. A reviewer should be able to see the exact file,
        page, message, or staff record that supports it. Preserve the original wording and precision
        when it differs from a normalized value.
      </p>
      <ul>
        <li>Field name and current value, with precision where relevant.</li>
        <li>Source type, file version, page or message timestamp, and date received.</li>
        <li>Confidence or review status with a plain explanation of why it is uncertain.</li>
        <li>Earlier values and the event that changed the current value.</li>
        <li>Reviewer, decision, date, and any follow-up still open.</li>
      </ul>
      <p>
        A confidence score is a triage signal, not proof. Do not let an extraction model silently
        replace a value or make legal conclusions. Route low-confidence extraction, conflicting
        sources, and consequential changes to the responsible reviewer. See{" "}
        <Link href="/resources/build-a-clear-employment-timeline">
          how to compare mixed date records without erasing their sources
        </Link>
        .
      </p>

      <h2>Make the conflict list the handoff’s first stop</h2>
      <p>
        Put unresolved questions in a short queue with the exact difference and the next owner.
        “Employment date mismatch” is more useful than “data issue”; “CV says April, applicant
        message says March, employer letter not received” is better still. The reviewer can then
        decide whether to ask a question, wait for a record, or interpret the discrepancy.
      </p>
      <div className="example-request">
        <span className="example-request__label">Example review note</span>
        <p>
          <strong>Needs human clarification · No value selected</strong>
          <br />
          Applicant message: March 2023. CV: April 2023. Employer letter: requested, not received.
          Next owner: case manager. Next action: ask for the employer’s recorded start date and
          attach the reply to this field.
        </p>
      </div>

      <h2>Finish with a bounded handoff</h2>
      <p>
        The reviewer should receive a compact summary: items still missing, items received but not
        checked, fields that disagree, decisions already recorded, and tasks that remain open. Link
        to source documents instead of sending unexplained copies. Confirm who owns each open item
        and what the next update should be.
      </p>
      <p>
        The U.S. Department of State explains that immigrant visa applicants must bring certain
        original or certified civil documents to interview even when copies were uploaded earlier.
        That example shows why “received” and “ready for this stage” need to remain distinct. Read
        the current{" "}
        <a
          href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-10-prepare-for-the-interview/step-11-applicant-interview.html"
          target="_blank"
          rel="noreferrer"
        >
          official interview instructions
        </a>{" "}
        for that process, and have a qualified professional decide what applies to a specific
        matter.
      </p>
      <p>
        If the recurring gap is that updates disappear across channels, start with{" "}
        <Link href="/resources/one-case-record-whatsapp-email-crm">
          the one-case-record workflow
        </Link>
        . If the team spends its day sending the same request again, use{" "}
        <Link href="/resources/immigration-document-checklist-follow-up-system">
          the document follow-up system
        </Link>
        . MatterZero is exploring these operational handoffs with early teams;{" "}
        <Link href="/#pilot">scope a one-workflow pilot</Link> around the process you want to
        improve.
      </p>
      <p className="article-source">
        <strong>Official references:</strong>{" "}
        <a
          href="https://www.uscis.gov/sites/default/files/document/forms/i-821instr.pdf"
          target="_blank"
          rel="noreferrer"
        >
          USCIS Form I-821 instructions (form-specific example)
        </a>
        {" · "}
        <a
          href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-10-prepare-for-the-interview/step-11-applicant-interview.html"
          target="_blank"
          rel="noreferrer"
        >
          U.S. Department of State: applicant interview
        </a>
        . These are examples for specific processes, not a universal checklist. This article is
        operational guidance, not legal advice.
      </p>
      <RelatedArticles current="immigration-case-file-readiness-review-checklist" />
    </>
  );
}

function RelatedArticles({ current }: { current: string }) {
  const related = [
    { slug: "organize-before-o1a-consultation", title: "Organize before an O-1A consultation" },
    { slug: "document-requests-applicants-can-follow", title: "Write clearer document requests" },
    { slug: "build-a-clear-employment-timeline", title: "Build a source-linked timeline" },
    {
      slug: "immigration-document-checklist-follow-up-system",
      title: "Build an immigration document follow-up system",
    },
    {
      slug: "one-case-record-whatsapp-email-crm",
      title: "Keep WhatsApp, email, and CRM updates in one case record",
    },
    {
      slug: "immigration-case-file-readiness-review-checklist",
      title: "Review a case file for missing and conflicting evidence",
    },
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
