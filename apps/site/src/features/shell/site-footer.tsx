/* eslint-disable @next/next/no-html-link-for-pages -- Static marketing navigation uses browser links instead of client-side route code. */
import { Container } from "@matterzero/ui";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <div>
            <a href="/" className="brand brand--footer">
              <span className="brand-mark" aria-hidden="true">
                <span />
              </span>
              <span className="brand-word">
                matter<span>zero</span>
              </span>
            </a>
            <p>Clearer files. Calmer handoffs.</p>
          </div>
          <div className="footer-links">
            <div>
              <span className="footer-label">Explore</span>
              <a href="/#how-it-works">How it works</a>
              <a href="/#teams">For immigration teams</a>
              <a href="/resources">Field notes</a>
            </div>
            <div>
              <span className="footer-label">Connect</span>
              <a href="https://www.linkedin.com/in/ankanganguly/" target="_blank" rel="noreferrer">
                Ankan on LinkedIn ↗
              </a>
              <a href="/#faq">FAQs</a>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} MatterZero</span>
          <span>Information organization for human review. Not legal advice.</span>
        </div>
      </Container>
    </footer>
  );
}
