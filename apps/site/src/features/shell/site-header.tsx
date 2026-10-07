/* eslint-disable @next/next/no-html-link-for-pages -- Static marketing navigation uses browser links instead of client-side route code. */
import { Container, ButtonLink } from "@matterzero/ui";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <a href="/" className="brand" aria-label="MatterZero home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="/#how-it-works">How it works</a>
          <a href="/#teams">Who it helps</a>
          <a href="/resources">Field notes</a>
        </nav>
        <ButtonLink
          href="https://www.linkedin.com/in/ankanganguly/"
          target="_blank"
          rel="noreferrer"
          className="header-cta"
        >
          Discuss a pilot
        </ButtonLink>
      </Container>
    </header>
  );
}
