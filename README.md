# MatterZero Immigration

Applicant intake and document readiness for immigration teams.

MatterZero helps teams turn applicant conversations and incoming documents into a clear, traceable file for human review. The first public experience is a fast, server-rendered marketing site with practical immigration operations resources.

## Product direction

- **Primary audience:** Indian immigration consultancies.
- **Secondary audience:** U.S. immigration law firms.
- **Initial product workflow:** multilingual intake, checklist-driven collection, evidence provenance, discrepancy review, and human approval.
- **Legal boundary:** MatterZero organizes information for professional review. It does not determine eligibility, give legal advice, promise outcomes, or submit filings.
- **Pricing:** pilot pricing is discussed with early teams; no public rate has been validated yet.

## Monorepo

```text
apps/site/                 Next.js website, landing page, and resources
packages/ui/               Shared accessible components
packages/design-tokens/    Shared brand colors and design primitives
docs/decisions/            Product and architecture decision records
docs/research/             Pricing and market research notes
docs/seo/                  Search and editorial authority plan
```

## Run locally

Requirements: Node.js 22+ and pnpm 11+.

```bash
pnpm install
cp .env.example apps/site/.env.local
pnpm dev
```

Until a custom domain is configured, set `NEXT_PUBLIC_SITE_URL` to `https://matterzero.vercel.app` in Vercel Production. Marketing, sign-in, admin, and dashboard routes share this origin. Locally, use `http://localhost:3000`.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

GitHub Actions runs these checks on pull requests and pushes to `main`.

## Staff authentication

The first private-app slice is invite-only email sign-in, minimal pilot requests, and a single-admin review dashboard. Follow [the Supabase authentication setup](docs/auth-setup.md) to configure the project, email templates, and local environment variables. There is no team workspace or applicant data model yet.

## Database layer

Server-side application data uses Drizzle ORM with Supabase Postgres. Supabase JS remains the Auth client and handles the public pilot-request insert under RLS. Keep `DATABASE_URL` server-only; use the documented one-time Drizzle baseline before generating and applying future schema migrations. This milestone has no case or applicant data model yet.

## Content and authorship

Resources are attributed to Ankan Ganguly, with a factual product-builder bio and a link to his LinkedIn profile. Articles describe operational preparation and point readers to primary official sources for immigration rules. They are general information, not legal advice.

## Inspiration and research

The website takes inspiration from Remedy Legal's clear problem-to-process storytelling, but uses MatterZero's own visual identity, audience, copy, and product workflow. Pricing comparisons and the current recommendation are recorded in `docs/research/pricing-research.md`.

## License

All rights reserved while the product and brand are being developed. No license to reuse the MatterZero name or brand is granted.
