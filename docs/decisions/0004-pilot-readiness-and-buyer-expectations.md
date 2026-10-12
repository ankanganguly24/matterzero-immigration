# 0004 Pilot readiness and buyer expectations

- Status: Accepted for early-access marketing
- Date: 2026-10-12

## Problem and business benefit

A simulated buyer review found that the polished case preview could imply a working applicant product. It also found inconsistent pilot destinations and insufficient information about manual work, scope, and data handling. Clear availability and a predictable enquiry path help teams evaluate fit without assuming unreleased capabilities.

## Decision

- Label early-access status next to the hero; visibly mark case screens as fictional designs.
- Route primary pilot CTAs to `/request-pilot`; keep founder LinkedIn links for contact and attribution.
- Publish a current-capabilities table distinguishing released access features, manual scoping, and planned case features.
- Provide a fictional student-file walkthrough to explain the proposed workflow. It is explicitly not a working demo or a visa requirement list. Keep Indian consultancies primary and validate specialization with real customer interviews.
- Explain the review and follow-up journey without inventing response deadlines, automatic emails, meeting lengths, or a public price.
- Before starting, agree duration, users/cases, total costs, responsibilities, support, success measures, and data/export/exit arrangements.
- Publish only code-supported data-handling facts; do not assert unverified hosting regions, certifications, encryption-at-rest guarantees, or AI practices.

## Evidence and limits

The current repository has pilot requests, access grants, invite-only Supabase Auth, MFA-protected admin review, shared PostgreSQL throttling, and optional limited PostHog events. It has no applicant schema, document storage, team workspace, applicant reminders, multilingual intake, or CRM sync. Data-handling copy reflects that boundary and does not constitute verification of provider dashboard configuration.

The review is simulated, not customer research. This change does not establish a working student product, measured ROI, market demand, or willingness to pay.

## Next product milestone

Build and demonstrate one synthetic case workflow: intake observations, team-owned checklist, received versus reviewed statuses, an unclear document, a conflicting detail, reviewer resolution, and an explained readiness state. Validate entry/handoff effort with consultancy staff. Before accepting real applicant records, implement team authorization and document access controls, verify provider/security settings, and agree retention, processing, incident, and exit arrangements.
