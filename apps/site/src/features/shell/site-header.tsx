import Link from "next/link";
import { Container, ButtonLink } from "@matterzero/ui";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link href="/" className="brand" aria-label="MatterZero home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#teams">Who it helps</Link>
          <Link href="/resources">Field notes</Link>
          <Link href="/login" data-analytics-event="sign_in_header_clicked">
            Sign in
          </Link>
        </nav>
        <ButtonLink
          href="/request-pilot"
          className="header-cta"
          data-analytics-event="pilot_cta_header_clicked"
        >
          Request a pilot
        </ButtonLink>
      </Container>
    </header>
  );
}
