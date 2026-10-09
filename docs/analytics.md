# Product analytics

MatterZero uses PostHog for a small, explicit marketing and pilot-access funnel. Analytics is disabled unless both `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are set. The project token is public; never use a PostHog personal API key in a `NEXT_PUBLIC_` variable.

## Set up

1. Create a PostHog project and copy its project token and regional ingest host from Project Settings.
2. Set both environment variables in Vercel Production and redeploy. Keep Preview and local development disconnected or use a separate test project so test traffic does not distort production reporting.
3. Confirm the events in PostHog's live events view with a safe test visit and test account.

The SDK loads after hydration. Ad blockers and browser privacy settings can prevent client events from arriving, so these are directional product metrics rather than an exact count of every visit.

## Events

| Event                           | When it fires                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `$pageview`                     | Public home, resources, request-pilot, and sign-in pages only                   |
| `pilot_cta_header_clicked`      | Header pilot CTA                                                                |
| `pilot_cta_pricing_clicked`     | Early-access section pilot CTA                                                  |
| `pilot_discussion_hero_clicked` | Hero pilot discussion link                                                      |
| `sign_in_header_clicked`        | Marketing header sign-in link                                                   |
| `sign_in_from_pilot_clicked`    | Sign-in link on request-pilot page                                              |
| `pilot_from_sign_in_clicked`    | Pilot link on sign-in page                                                      |
| `pilot_request_submitted`       | A new pilot request is accepted                                                 |
| `pilot_request_already_on_file` | A duplicate pilot request receives the existing-request confirmation            |
| `pilot_request_failed`          | The request could not be completed                                              |
| `sign_in_link_requested`        | Supabase accepts a magic-link request; this does not prove delivery or link use |
| `sign_in_access_not_configured` | Server denies an email without an access grant                                  |
| `sign_in_link_request_failed`   | Access check or magic-link request fails                                        |
| `team_access_verified`          | A signed-in pilot user reaches the access-verified page                         |

Suggested funnels:

- Home pageview → pilot CTA → request-pilot pageview → pilot request submitted.
- Sign-in pageview → sign-in link requested → team access verified.

The current product has no team dashboard, so there are no case or workspace usage events yet. Add those alongside the dashboard's actual actions. Opening a magic link on another browser or device may prevent PostHog from joining the earlier anonymous visit to the verified user.

## Data boundary

Autocapture, automatic pageviews, session recording, surveys, and exception capture are disabled. Captured pageviews use public pathnames; URL properties have query strings and fragments removed before sending. Custom events have no email, organization, applicant, case, or document properties. After team access is verified, PostHog identifies the member by their Supabase user ID, without an email property; sign-out resets the browser identity.

Review the published privacy notice and applicable consent settings before enabling analytics in production. Keep future dashboard events limited to action names and coarse, approved properties.
