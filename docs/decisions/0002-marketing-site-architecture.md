# 0002 Marketing site architecture and design

- **Status:** Accepted
- **Date:** 2026-10-06

## Decision

Build a pnpm/Turborepo monorepo with a statically rendered Next.js App Router site in `apps/site`, shared UI in `packages/ui`, and global brand variables in `packages/design-tokens`. Use React Server Components by default and CSS for the first marketing experience.

## Visual direction

Use warm paper, deep forest green, pale mint, and a restrained coral accent. The page should feel editorial and calm, with clear whitespace and readable line lengths. Remedy Legal informed the problem-to-process storytelling pattern only; MatterZero uses its own layout, color palette, wording, and case-review visual. Use self-hosted Fraunces for display headings and DM Sans for body and interface text.

## Scope

- Landing page, resource index, three resource articles, sitemap, robots file, metadata, structured data, and custom 404.
- No account flow, pricing checkout, contact database, or invented customer proof.
- Pilot CTA links to Ankan Ganguly’s supplied LinkedIn profile until a product domain/contact route exists.
- Hero product UI is HTML/CSS, avoiding a large image and keeping its dimensions stable.

## Performance target

Aim for a fast mobile experience with no layout shift. Keep fonts self-hosted, avoid analytics and unnecessary client JavaScript, and reserve layout space for visual elements. CI Lighthouse enforces a 2,500 ms LCP maximum, 0.1 CLS maximum, 90 performance score, 95 SEO score, and 95 accessibility score; field performance varies by network and device.

## Open deployment item

The canonical production domain is not known. Set `NEXT_PUBLIC_SITE_URL` in hosting before deployment. Do not publish localhost or the CI `.invalid` origin as the canonical URL.
