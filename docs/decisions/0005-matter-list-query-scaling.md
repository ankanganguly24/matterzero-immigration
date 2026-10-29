# 0005 Server-side matter list queries and reusable controls

- **Status:** Accepted
- **Date:** 2026-10-29

## Context

The Matters Hub initially loaded up to 500 records into the browser and performed search and status filtering locally. This limited the list, transferred more applicant data than the visible page required, and made pagination and sorting unreliable as workspaces grew.

## Decision

- Query matters on the server using a fixed 25-row page, workspace scope, validated search/filter/sort parameters, and stable ordering.
- Keep query state in the URL so the current search, filters, sort, and page can be refreshed or shared.
- Provide server-side search over applicant name, email, petition type, and assigned-member email; status and assignee filters; and sorting by recency, applicant name, petition, status, or assignee.
- Add PostgreSQL trigram indexes for substring search and workspace-prefixed B-tree indexes for common filters and orderings.
- Extract the repeated dropdown styling/behavior into `SelectControl` and the page navigation into `Pagination`, so these patterns remain consistent across forms and list views.

## Trade-offs

- Exact filtered counts require a count query in addition to fetching the visible page. This is appropriate for the current pilot scale; revisit approximate counts or cursor pagination if workspaces grow enough that count/offset latency becomes material.
- Trigram indexes improve substring search but add storage and write cost. Very short search strings may still need a scan because they provide few useful trigrams.
- Search and filters remain constrained to the active workspace and authorized server request; no client-side copy of the full matter list is sent to the browser.
- The reusable controls live in the site app because they currently share app-specific styling and do not yet need to be part of the monorepo-wide UI package.

## Revisit when

Production query plans or pilot usage show slow counts, large offsets, or a need to filter additional case fields. Reevaluate keyset pagination, full-text search, or a broader shared design-system component at that point.
