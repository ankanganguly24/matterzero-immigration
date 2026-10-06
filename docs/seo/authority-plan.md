# Organic search and authority plan

## Technical foundation

- Server-render pages and emit metadata in the initial HTML.
- Keep exactly one H1 per page; use semantic heading order.
- Generate canonical URLs from `NEXT_PUBLIC_SITE_URL`; use a single normalized URL for each page.
- Keep one-hop or zero-hop routes. Do not introduce chained redirects for trailing slashes, www, or old slugs before the canonical domain is selected.
- Include only canonical, indexable pages in `sitemap.xml`; publish a matching `robots.txt`.
- Link the resource index, every article, the homepage, and relevant article references together so no article is orphaned.
- Add visible FAQ content before FAQPage JSON-LD and visible breadcrumb navigation before BreadcrumbList JSON-LD. Structured data does not guarantee enhanced search results.
- If bitmap media is added, ship optimized WebP/AVIF with dimensions and useful alt text. The initial hero uses an accessible HTML/CSS product preview and avoids a large image download.
- Measure production performance on mobile and desktop. Treat sub-two-second loading as a target under defined test conditions, not a universal guarantee.

## Content quality and authorship

Articles are attributed to Ankan Ganguly with a narrow factual bio: he is building MatterZero and writes about immigration-team workflows. No lawyer, immigration adviser, or case outcome claims are made. Each article cites primary official sources where it discusses legal categories and includes a general-information disclaimer.

## Backlink strategy

Do not buy links, use link farms, or promise Forbes/editorial placements. Build genuinely useful resources (printable document-request checklists, source-linked explainers, original pilot benchmarks when real data exists), then pitch them through relevant immigration associations, practitioner newsletters, conferences, product communities, and journalists. Any benchmark must use real, permissioned, anonymized data and a stated method. Editorial coverage and backlinks are earned outcomes, not implementation features.

## Search references

- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Breadcrumb structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
