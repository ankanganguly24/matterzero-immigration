import Link from "next/link";
import { Container } from "@matterzero/ui";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <Container>
        <p className="eyebrow">404 · Page not found</p>
        <h1>Looks like this file went missing.</h1>
        <p className="lede">Let’s get you back to the useful part.</p>
        <div className="button-row">
          <Link href="/" className="button button--primary">
            Back to MatterZero <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/resources" className="button button--secondary">
            Browse field notes <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
