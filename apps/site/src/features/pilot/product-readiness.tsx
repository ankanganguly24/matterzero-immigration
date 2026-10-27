import Link from "next/link";
import { Container } from "@matterzero/ui";
import styles from "./product-readiness.module.css";

const readinessRows = [
  {
    illustration: "access",
    title: "Request and discuss a pilot",
    detail:
      "Pilot requests, admin review, invitations, and sign-in are available. Explore a separate interactive demo with fictional data.",
    href: "/request-pilot",
    action: "Request a pilot",
  },
  {
    illustration: "sample",
    title: "Explore a sample file",
    detail:
      "Walk through an interactive fictional evidence workflow. No real applicant data or legal checklist is used.",
    href: "/dashboard/demo",
    action: "Open the evidence demo",
  },
  {
    illustration: "agreement",
    title: "Scope, cost, and data handling",
    detail:
      "We agree the workflow, staff effort, capabilities, total fee, and data arrangements before a pilot begins.",
    href: "/data-handling",
    action: "Read how we handle data",
  },
] as const;

export function ProductReadiness() {
  return (
    <section className={styles.readiness} aria-labelledby="readiness-heading" id="product-status">
      <Container>
        <header className={styles.readinessHeader}>
          <p className="eyebrow">Early access</p>
          <h2 id="readiness-heading">What’s ready today?</h2>
        </header>
        <ol className={styles.readinessRows}>
          {readinessRows.map((row) => (
            <li key={row.title} className={styles.readinessRow}>
              <div className={styles.readinessVisual}>
                <ReadinessIllustration variant={row.illustration} />
              </div>
              <div>
                <h3>{row.title}</h3>
                <p>{row.detail}</p>
                <Link className="text-link" href={row.href}>
                  {row.action} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

type IllustrationVariant = "access" | "sample" | "agreement";

function ReadinessIllustration({ variant }: { variant: IllustrationVariant }) {
  return (
    <span className={`${styles.illustration} ${styles[`illustration--${variant}`]}`}>
      <svg viewBox="0 0 120 76" fill="none" aria-hidden="true" focusable="false">
        {variant === "access" && (
          <>
            <rect className={styles.illustrationCard} x="22" y="13" width="70" height="49" rx="9" />
            <path className={styles.illustrationLine} d="M34 24h25" />
            <circle className={styles.illustrationAccent} cx="48" cy="39" r="7" />
            <path
              className={styles.illustrationLine}
              d="M36 54c1.8-5 6-7.5 12-7.5s10.2 2.5 12 7.5"
            />
            <circle className={styles.illustrationBadge} cx="86" cy="52" r="12" />
            <path className={styles.illustrationCheck} d="m80.5 52 3.7 3.7 7.2-7.4" />
          </>
        )}
        {variant === "sample" && (
          <>
            <path className={styles.illustrationCard} d="M35 12h35l15 15v36H35z" />
            <path className={styles.illustrationFold} d="M70 12v15h15" />
            <path className={styles.illustrationLine} d="M45 36h29M45 44h23M45 52h18" />
            <path
              className={styles.illustrationSparkle}
              d="m95 24 2.2 6.8L104 33l-6.8 2.2L95 42l-2.2-6.8L86 33l6.8-2.2z"
            />
            <circle className={styles.illustrationAccent} cx="28" cy="51" r="4" />
          </>
        )}
        {variant === "agreement" && (
          <>
            <rect className={styles.illustrationCard} x="29" y="11" width="57" height="53" rx="8" />
            <path className={styles.illustrationLine} d="M42 24h28" />
            <rect
              className={styles.illustrationCheckbox}
              x="42"
              y="32"
              width="7"
              height="7"
              rx="2"
            />
            <path className={styles.illustrationCheck} d="m43.5 35.5 1.5 1.5 3-3" />
            <path className={styles.illustrationLine} d="M54 35.5h17" />
            <rect
              className={styles.illustrationCheckbox}
              x="42"
              y="46"
              width="7"
              height="7"
              rx="2"
            />
            <path className={styles.illustrationLine} d="M54 49.5h17" />
            <circle className={styles.illustrationBadge} cx="87" cy="52" r="12" />
            <path className={styles.illustrationCheck} d="m81.5 52 3.7 3.7 7.2-7.4" />
          </>
        )}
      </svg>
    </span>
  );
}
