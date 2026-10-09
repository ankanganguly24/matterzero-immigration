import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@matterzero/ui";
import { articles } from "@/features/resources/articles";
import { ArticleBody } from "@/features/resources/article-body";
import { BreadcrumbJsonLd, JsonLd } from "@/features/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return { title: "Resource not found", robots: { index: false, follow: true } };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/resources/${article.slug}`,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const articleUrl = `${siteUrl}/resources/${article.slug}`;
  return (
    <main id="main-content" className="page-main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.date,
          mainEntityOfPage: articleUrl,
          author: { "@type": "Person", name: article.author.name, url: article.author.url },
          publisher: { "@type": "Organization", name: "MatterZero", url: siteUrl },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: article.shortTitle, path: `/resources/${article.slug}` },
        ]}
      />
      <article className="article-page">
        <Container>
          <nav aria-label="Breadcrumb" className="breadcrumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources">Resources</Link>
            <span aria-hidden="true">/</span>
            <span>{article.shortTitle}</span>
          </nav>
          <header className="article-header">
            <p className="eyebrow">
              {article.category} <span aria-hidden="true">·</span> {article.readTime}
            </p>
            <h1>{article.title}</h1>
            <p className="article-deck">{article.description}</p>
            <div className="author-line">
              <div className="author-avatar" aria-hidden="true">
                AG
              </div>
              <div>
                <p>
                  <a href={article.author.url} target="_blank" rel="noreferrer">
                    {article.author.name}
                  </a>
                </p>
                <span>
                  {article.author.role} ·{" "}
                  {new Date(article.date).toLocaleDateString("en-IN", {
                    dateStyle: "long",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </div>
          </header>
          <div className="article-layout">
            <div className="article-body">
              <ArticleBody slug={article.slug} />
            </div>
            <aside className="article-aside" aria-label="About the author">
              <p className="eyebrow">Written by</p>
              <h2>{article.author.name}</h2>
              <p>{article.author.bio}</p>
              <a className="text-link" href={article.author.url} target="_blank" rel="noreferrer">
                Connect on LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <div className="aside-note">
                General information only. Immigration decisions and legal strategy belong with a
                qualified professional.
              </div>
            </aside>
          </div>
          <footer className="article-end">
            <Link href="/resources" className="text-link">
              ← All field notes
            </Link>
            <span>Questions about your team’s intake workflow?</span>
            <a
              href="https://www.linkedin.com/in/ankanganguly/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Talk with Ankan <span aria-hidden="true">↗</span>
            </a>
          </footer>
        </Container>
      </article>
    </main>
  );
}
