# 0002 Marketing site architecture and design

- **Status:** Accepted
- **Date:** 2026-10-06

## Decision

Build a pnpm/Turborepo monorepo with a statically rendered Next.js App Router site in `apps/site`, shared UI in `packages/ui`, and global brand variables in `packages/design-tokens`. Use React Server Components by default and CSS for the first marketing experience.

## Visual direction

Use warm paper, deep forest green, pale mint, and a restrained coral accent. The page should feel editorial and calm, with clear whitespace and readable line lengths. Remedy Legal informed the problem-to-process storytelling pattern only; MatterZero uses its own layout, color palette, wording, and case-review visual.

## Scope

- Landing page, resource index, three resource articles, sitemap, robots file, metadata, structured data, and custom 404.
- No account flow, pricing checkout, contact database, or invented customer proof.
- Pilot CTA links to Ankan Ganguly’s supplied LinkedIn profile until a product domain/contact route exists.
- Hero product UI is HTML/CSS, avoiding a large image and keeping its dimensions stable.

## Performance target

Aim for sub-two-second Largest Contentful Paint under a documented Lighthouse production test. Keep the initial bundle small, avoid third-party fonts and analytics, and reserve layout space for all visual elements. The CI Lighthouse job enforces a 2,000 ms LCP budget on its runner; field performance can vary by network and device.

## Open deployment item

The canonical production domain is not known. Set `NEXT_PUBLIC_SITE_URL` in hosting before deployment. Do not publish localhost or the CI `.invalid` origin as the canonical URL.
