# MatterZero repository guide

## Product focus

MatterZero helps immigration teams prepare applicant files for human review through multilingual intake, document collection, structured evidence, and clear follow-up. Lead with Indian immigration consultancies; also speak to U.S. immigration law firms. The O-1A pre-matter workflow is the first deep product example.

## Scope guardrails

- This repository currently contains the marketing site and editorial resources only.
- Do not claim MatterZero determines immigration eligibility, recommends legal strategy, predicts outcomes, or files cases.
- Do not invent customers, testimonials, performance results, legal credentials, or pricing commitments.
- Keep pricing framed as pilot pricing until interviews and willingness-to-pay evidence support a published rate.
- The named article author is Ankan Ganguly. Keep the bio factual and link to the supplied LinkedIn profile; do not imply legal expertise.
- Do not promise press coverage or backlinks. Earn citations through useful, original, accurately sourced resources.

## Architecture rules

- Monorepo uses pnpm workspaces and Turborepo.
- Web experience lives in `apps/site`; reusable UI and design tokens live in `packages/ui` and `packages/design-tokens`.
- Keep routes and editorial content feature-based. Shared visual changes belong in tokens and shared components.
- Prefer Next.js Server Components and statically rendered pages. Add client JavaScript only for an observable user need.
- Keep the canonical domain in `NEXT_PUBLIC_SITE_URL`; do not hard-code a guessed public domain.
- Every indexable route needs a title, description, canonical URL, and internal links.
- Articles need accurate sources, clear authorship, and a plain-language note that they are general information, not legal advice.

## Working commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`

## Protected material

Files under `sources/` are read-only synced reference material. Never edit, rename, move, or delete them.
