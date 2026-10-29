# 0006 — Maintain a decision ledger

- **Status:** Accepted
- **Date:** 2026-10-29

## Context

MatterZero's product and engineering direction spans multiple work sessions. Decisions made only in chat are easy to lose, and later implementation can silently diverge from earlier choices.

## Decision

Use `docs/decisions/` as the durable ledger for material product, architecture, security, data-model, and operational decisions. Before implementing a material decision, add a numbered Markdown record in the existing ADR style. Records should capture context, the selected approach, meaningful alternatives or tradeoffs, and consequences.

When a decision changes, update its record with the new status and rationale or create a superseding record that links to the earlier one. Change summaries and pull requests should reference relevant decision records. Routine implementation details that do not affect product behavior, architecture, security, or operations do not need separate records.

## Consequences

- Product and engineering direction remains reviewable across branches and conversations.
- Changes can be checked against prior decisions before implementation.
- Material decisions add a small documentation step; trivial code choices do not create unnecessary ADRs.
