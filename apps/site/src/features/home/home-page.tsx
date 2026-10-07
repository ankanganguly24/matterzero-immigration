import Link from "next/link";
import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { articles } from "@/features/resources/articles";
import { homeFaqs } from "./home-content";

type HomePageProps = {
  ButtonLink: ComponentType<{
    href: string;
    children: ReactNode;
    variant?: "primary" | "secondary" | "light";
    className?: string;
    target?: string;
    rel?: string;
  }>;
  Container: ComponentType<HTMLAttributes<HTMLElement> & { children: ReactNode }>;
  SectionHeading: ComponentType<{
    eyebrow: string;
    title: string;
    children?: ReactNode;
    align?: "left" | "center";
  }>;
};

export function HomePage({ ButtonLink, Container, SectionHeading }: HomePageProps) {
  return (
    <main id="main-content">
      <section className="hero">
        <Container className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow-dot" /> For Indian immigration consultancies
            </p>
            <h1>
              Know what’s missing from every applicant file.
            </h1>
            <p className="hero__lede">
              MatterZero helps your team keep applicant details and documents together, spot gaps or
              mismatches, and see what needs follow-up.
            </p>
            <div className="button-row">
              <ButtonLink
                href="https://www.linkedin.com/in/ankanganguly/"
                variant="light"
                target="_blank"
                rel="noreferrer"
              >
                Discuss a one-workflow pilot
              </ButtonLink>
            </div>
            <p className="hero__note">
              Start with one workflow. Keep your current process. Staff make the decisions.
            </p>
          </div>
          <ReadinessPreview />
        </Container>
        <div className="hero__orbit hero__orbit--one" aria-hidden="true" />
        <div className="hero__orbit hero__orbit--two" aria-hidden="true" />
      </section>

      <section className="trust-strip" aria-label="Workflow summary">
        <Container className="trust-strip__inner">
          <span>From first conversation</span>
          <span aria-hidden="true">→</span>
          <span>to source-linked evidence</span>
          <span aria-hidden="true">→</span>
          <span>to human review</span>
        </Container>
      </section>

      <section className="section section--intro" id="how-it-works">
        <Container>
          <SectionHeading
            eyebrow="How teams use MatterZero"
            title="Four clear steps from first conversation to human review."
          >
            Bring intake, document collection, and evidence review into one guided flow that fits
            around the process your team already uses.
          </SectionHeading>
          <ol className="workflow-grid" aria-label="How to use MatterZero">
            <WorkflowCard
              number="01"
              title="Open a matter"
              body="Start with an enquiry, select the team’s workflow, and note the applicant’s preferred language and contact channel."
              detail="Set the context before the first question."
              tone="mint"
            />
            <WorkflowCard
              number="02"
              title="Gather the story"
              body="Use a guided voice or written intake to collect key details. Keep answers structured and leave uncertain points visible for confirmation."
              detail="Keep the applicant’s own words in view."
              tone="peach"
            />
            <WorkflowCard
              number="03"
              title="Complete the checklist"
              body="Request each document with a plain explanation of what the team needs. Track what is missing, received, or needs a clearer copy."
              detail="Make the next request easy to act on."
              tone="mint"
            />
            <WorkflowCard
              number="04"
              title="Review and hand off"
              body="Compare details across answers and documents. Follow each source, resolve open questions, and let an authorized person approve the handoff."
              detail="A human stays responsible for the decision."
              tone="blue"
            />
          </ol>
        </Container>
      </section>

      <section className="section section--deep">
        <Container className="split-section">
          <div>
            <p className="eyebrow eyebrow--light">Make the file make sense</p>
            <h2>
              Not another place to store documents.
              <br />
              <em>A clearer view of what they say.</em>
            </h2>
            <p className="section-copy section-copy--light">
              A passport, a CV, and a conversation can all describe the same person differently.
              MatterZero keeps each source visible, flags the gap, and leaves the decision with your
              team.
            </p>
            <ButtonLink href="#human-review" variant="light">
              See the human review boundary
            </ButtonLink>
          </div>
          <div
            className="evidence-card"
            aria-label="Example of source-linked information for a reviewer"
          >
            <div className="evidence-card__top">
              <span className="status-dot" /> <span>Timeline detail</span>
              <span className="review-tag">Needs review</span>
            </div>
            <h3>Employment start date</h3>
            <div className="evidence-source">
              <span className="source-icon source-icon--voice">V</span>
              <div>
                <strong>Applicant conversation</strong>
                <small>“I joined in March 2023”</small>
              </div>
              <span className="source-value">March ’23</span>
            </div>
            <div className="evidence-source">
              <span className="source-icon source-icon--doc">CV</span>
              <div>
                <strong>Curriculum vitae</strong>
                <small>Page 2 · Employment history</small>
              </div>
              <span className="source-value">April ’23</span>
            </div>
            <div className="evidence-source">
              <span className="source-icon source-icon--doc">PDF</span>
              <div>
                <strong>Employer letter</strong>
                <small>Page 1 · Start date</small>
              </div>
              <span className="source-value">27 Mar</span>
            </div>
            <div className="evidence-card__footer">
              <span>Three sources. One human decision.</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--pilot-safeguards" id="pilot">
        <Container>
          <SectionHeading
            eyebrow="A lower-risk first step"
            title="See whether it helps before changing the way your whole team works."
          >
            A MatterZero pilot starts with one repeatable workflow and a clear boundary around what
            the product does. You can judge the fit before discussing a wider rollout.
          </SectionHeading>
          <div className="pilot-safeguards-grid">
            <article className="pilot-safeguard">
              <span>01</span>
              <h3>One workflow first</h3>
              <p>Choose a familiar intake or document-follow-up process with your team.</p>
            </article>
            <article className="pilot-safeguard">
              <span>02</span>
              <h3>Agree the scope up front</h3>
              <p>
                Set the case volume, handoff, measures of value, and pilot price before starting.
              </p>
            </article>
            <article className="pilot-safeguard">
              <span>03</span>
              <h3>Keep people in control</h3>
              <p>Staff review uncertain or conflicting details and own every case decision.</p>
            </article>
            <article className="pilot-safeguard">
              <span>04</span>
              <h3>Check system fit together</h3>
              <p>
                Confirm how information will move before the pilot. No universal CRM connection is
                assumed.
              </p>
            </article>
          </div>
          <p className="pilot-safeguards-note">
            MatterZero is in early access development. Pilot capabilities and data handling are
            confirmed with each team before real applicant records are used.
          </p>
        </Container>
      </section>

      <section className="section section--audience" id="teams">
        <Container>
          <SectionHeading
            eyebrow="Starting with Indian consultancies"
            title="Give the people doing the follow-up a better starting point."
            align="center"
          >
            Built for teams managing recurring applicant intake, document collection, and too many
            open loops. U.S. immigration law teams are a secondary audience we are exploring.
          </SectionHeading>
          <div className="audience-grid">
            <article className="audience-card">
              <span className="audience-number">PRIMARY / INDIA</span>
              <h3>For Indian immigration consultancies</h3>
              <p>
                Keep multilingual intake, document requests, and counsellor handoffs moving without
                asking staff to reconstruct every file from scattered messages.
              </p>
              <ul>
                <li>Applicant intake across languages</li>
                <li>State-aware document requests</li>
                <li>Clear missing-item and review queues</li>
              </ul>
            </article>
            <article className="audience-card audience-card--dark">
              <span className="audience-number">ALSO EXPLORING / U.S.</span>
              <h3>For immigration law teams</h3>
              <p>
                Prepare a better-organized pre-matter file while keeping legal interpretation and
                case strategy firmly with the attorney.
              </p>
              <ul>
                <li>Source-linked applicant facts</li>
                <li>Evidence and timeline review</li>
                <li>Human-approved case handoff</li>
              </ul>
            </article>
          </div>
        </Container>
      </section>

      <section className="section section--safety" id="human-review">
        <Container className="safety-panel">
          <div className="safety-icon" aria-hidden="true">
            ↗
          </div>
          <div>
            <p className="eyebrow">A deliberate boundary</p>
            <h2>
              Organize the information.
              <br />
              Leave legal judgment to people.
            </h2>
            <p>
              MatterZero helps teams collect, compare, and prepare applicant information. It does
              not decide eligibility, recommend a legal path, promise an outcome, or file an
              application.
            </p>
          </div>
          <div className="safety-stamp">
            <span>Human</span>
            <strong>review</strong>
            <span>always</span>
          </div>
        </Container>
      </section>

      <section className="section section--pricing">
        <Container className="pricing-panel">
          <div>
            <p className="eyebrow eyebrow--light">Early access</p>
            <h2>
              Start with the workflow.
              <br />
              <em>Price the value together.</em>
            </h2>
            <p>
              We’re speaking with early teams to shape a pilot around case volume, document
              workflows, and actual staff time saved. No oversized platform bundle. No made-up
              savings claims.
            </p>
            <ButtonLink
              href="https://www.linkedin.com/in/ankanganguly/"
              variant="light"
              target="_blank"
              rel="noreferrer"
            >
              Discuss a pilot
            </ButtonLink>
          </div>
          <div className="pricing-aside">
            <span className="pricing-aside__label">Founding team pilot</span>
            <strong>
              Designed around
              <br />
              your current process.
            </strong>
            <ul>
              <li>Start with one workflow</li>
              <li>Agree on a clear case limit</li>
              <li>Review value before expanding</li>
            </ul>
            <small>Pricing is discussed with each pilot team.</small>
          </div>
        </Container>
      </section>

      <section className="section section--resources">
        <Container>
          <div className="resource-heading">
            <SectionHeading
              eyebrow="The field notes"
              title="Good casework begins before the case file."
            >
              Practical guides for collecting information, organizing evidence, and making the
              handoff clearer.
            </SectionHeading>
            <Link className="text-link" href="/resources">
              All resources <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="article-grid article-grid--home">
            {articles.map((article) => (
              <article className="article-card" key={article.slug}>
                <p className="article-card__meta">
                  {article.category} <span aria-hidden="true">·</span> {article.readTime}
                </p>
                <h3>
                  <Link href={`/resources/${article.slug}`}>{article.title}</Link>
                </h3>
                <p>{article.description}</p>
                <Link className="text-link" href={`/resources/${article.slug}`}>
                  Read the guide <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section--faq" id="faq">
        <Container className="faq-layout">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2>Clear answers before you try it.</h2>
            <p className="section-copy">
              Know what the pilot covers, what it does not, and what your team decides.
            </p>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/ankanganguly/"
              target="_blank"
              rel="noreferrer"
            >
              Connect with Ankan <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="faq-list">
            {homeFaqs.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

function ReadinessPreview() {
  return (
    <div
      className="readiness-preview"
      role="img"
      aria-label="Illustrative MatterZero case review screen showing intake progress, document checklist, and one item that needs human review"
    >
      <div className="preview-window">
        <div className="preview-topbar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span>CASE OVERVIEW</span>
          <span className="preview-privacy">
            <b /> PRIVATE WORKSPACE
          </span>
        </div>
        <div className="preview-content">
          <div className="preview-title-row">
            <div>
              <span className="preview-kicker">APPLICANT INTAKE · MZ-2048</span>
              <h2>Applicant overview</h2>
            </div>
            <span className="preview-avatar">AS</span>
          </div>
          <div className="preview-stats">
            <div>
              <span>INTAKE</span>
              <strong>Complete</strong>
              <small>Last updated just now</small>
            </div>
            <div>
              <span>DOCUMENTS</span>
              <strong>
                8 <small>/ 11 received</small>
              </strong>
              <small>3 items still needed</small>
            </div>
          </div>
          <div className="preview-checklist">
            <div className="preview-checklist__head">
              <strong>Next steps</strong>
              <span>View checklist ↗</span>
            </div>
            <div className="preview-row">
              <span className="checkmark">✓</span>
              <span>Applicant profile</span>
              <small>Reviewed</small>
            </div>
            <div className="preview-row">
              <span className="checkmark">✓</span>
              <span>Passport and status</span>
              <small>Received</small>
            </div>
            <div className="preview-row preview-row--alert">
              <span className="alertmark">!</span>
              <span>Employment timeline</span>
              <small>Needs a look</small>
            </div>
          </div>
          <div className="preview-bottom">
            <span className="review-avatar">AG</span>
            <span>Source-linked. Human-reviewed.</span>
            <span className="preview-shield" aria-hidden="true">
              ✳
            </span>
          </div>
        </div>
      </div>
      <div className="floating-note">
        <span className="floating-note__icon">↗</span>
        <span>
          <strong>One detail to resolve</strong>
          <small>See all three source references</small>
        </span>
      </div>
    </div>
  );
}

function WorkflowCard({
  number,
  title,
  body,
  detail,
  tone,
}: {
  number: string;
  title: string;
  body: string;
  detail: string;
  tone: string;
}) {
  return (
    <li className={`workflow-card workflow-card--${tone}`}>
      <div className="workflow-card__top">
        <span>{number}</span>
        <span className="workflow-icon" aria-hidden="true">
          {number === "01" ? "↗" : number === "02" ? "◌" : number === "03" ? "＋" : "✓"}
        </span>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <small>{detail}</small>
    </li>
  );
}
