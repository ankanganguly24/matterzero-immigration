import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@matterzero/ui";

type PilotArticleLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  sidebarTitle: string;
  sidebarDescription: string;
  children: ReactNode;
};

export function PilotArticleLayout({
  eyebrow,
  title,
  description,
  sidebarTitle,
  sidebarDescription,
  children,
}: PilotArticleLayoutProps) {
  return (
    <main id="main-content" className="page-main">
      <article className="article-page">
        <Container>
          <header className="article-header">
            <nav aria-label="Breadcrumb" className="breadcrumbs">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>{title}</span>
            </nav>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="article-deck">{description}</p>
          </header>
          <div className="article-layout">
            <div className="article-body">{children}</div>
            <aside className="article-aside" aria-label="Early access information">
              <p className="eyebrow">Early access</p>
              <h2>{sidebarTitle}</h2>
              <p>{sidebarDescription}</p>
              <Link href="/request-pilot" className="text-link">
                Request a pilot <span aria-hidden="true">→</span>
              </Link>
              <div className="aside-note">
                Use fictional examples in the first discussion. Do not send applicant documents or
                case details through this website or LinkedIn.
              </div>
            </aside>
          </div>
          <footer className="article-end">
            <Link href="/resources" className="text-link">
              ← Field notes
            </Link>
            <span>Information organization for professional review.</span>
            <Link href="/request-pilot" className="text-link">
              Discuss a pilot <span aria-hidden="true">→</span>
            </Link>
          </footer>
        </Container>
      </article>
    </main>
  );
}
