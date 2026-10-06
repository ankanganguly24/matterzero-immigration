import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@matterzero/ui";
import { articles } from "@/features/resources/articles";
import { BreadcrumbJsonLd } from "@/features/seo/json-ld";

export const metadata: Metadata = {
  title: "Immigration team field notes",
  description:
    "Practical guides to applicant intake, evidence organization, and document handoffs for immigration teams.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <main id="main-content" className="page-main">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ]}
      />
      <section className="resource-hero">
        <Container>
          <nav aria-label="Breadcrumb" className="breadcrumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Resources</span>
          </nav>
          <p className="eyebrow">The MatterZero field notes</p>
          <h1>Clearer files start with clearer process.</h1>
          <p className="lede">
            Practical, source-linked notes for the people who gather applicant information, chase
            documents, and prepare files for professional review.
          </p>
        </Container>
      </section>
      <section className="resource-list">
        <Container>
          <div className="article-grid">
            {articles.map((article) => (
              <article className="article-card" key={article.slug}>
                <p className="article-card__meta">
                  {article.category} <span aria-hidden="true">·</span> {article.readTime}
                </p>
                <h2>
                  <Link href={`/resources/${article.slug}`}>{article.title}</Link>
                </h2>
                <p>{article.description}</p>
                <Link className="text-link" href={`/resources/${article.slug}`}>
                  Read the guide <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
