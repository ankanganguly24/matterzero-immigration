import Link from "next/link";
import { Container } from "@matterzero/ui";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <div>
            <Link href="/" className="brand brand--footer">
              <span className="brand-mark" aria-hidden="true">
                <span />
              </span>
              <span className="brand-word">
                matter<span>zero</span>
              </span>
            </Link>
            <p>Clearer files. Calmer handoffs.</p>
          </div>
          <div className="footer-links">
            <div>
              <span className="footer-label">Explore</span>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#teams">For immigration teams</Link>
              <Link href="/resources">Field notes</Link>
            </div>
            <div>
              <span className="footer-label">Connect</span>
              <a href="https://www.linkedin.com/in/ankanganguly/" target="_blank" rel="noreferrer">
                Ankan on LinkedIn ↗
              </a>
              <Link href="/#faq">FAQs</Link>
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
