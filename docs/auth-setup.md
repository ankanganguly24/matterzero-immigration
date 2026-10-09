# MatterZero staff authentication setup

This milestone provides invite-only email magic-link authentication, minimal pilot requests, and a single-admin invitation and request-review dashboard. It does not include a team workspace, applicant data, or authorization for case records.

## Supabase project setup

1. Create a Supabase project and copy its project URL and publishable key.
2. Copy `.env.example` to `apps/site/.env.local` and configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (use `http://localhost:3000` locally; use the canonical marketing origin in production)
   - `MATTERZERO_ADMIN_EMAIL` (the one administrator email)
   - `SUPABASE_SECRET_KEY` (server-only; never use a `NEXT_PUBLIC_` name)
   - `DATABASE_URL` (server-only Postgres connection string; use the Supabase transaction pooler for Vercel and keep `sslmode=require`)
3. In Supabase Auth, enable email sign-in and disable public sign-ups. Bootstrap the admin by inviting the configured admin email in the Supabase dashboard.
4. In Auth URL Configuration, allow `http://localhost:3000/auth/confirm` locally and `https://matterzero.vercel.app/auth/confirm` in production. Set the Supabase Site URL to `https://matterzero.vercel.app`. Use that same origin for marketing, sign-in links, and invitations until a custom domain is configured.
5. The default Supabase Magic Link template uses a PKCE code, which `/auth/confirm` exchanges for a session. Open a link in the same browser where it was requested so the PKCE verifier is available. Admin-issued pilot invitations and sign-in links return to the same MatterZero origin.

   Email security scanners can consume one-time links before the user opens them. To avoid that, configure custom SMTP, then update Supabase's **Magic Link** and **Invite user** templates to pass the token hash to the app. The app first presents a confirmation page and verifies the token only after the user presses **Confirm and sign in**. Supabase requires custom SMTP before its default email templates can be edited. These custom templates are optional; the default PKCE flow works without them.

   Example **Magic Link** template:

   ```html
   <h2>Sign in to MatterZero</h2>
   <p>Use this secure link to access your invited team account:</p>
   <p>
     <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=email">
       Sign in to MatterZero
     </a>
   </p>
   ```

   Example **Invite user** template:

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=invite">
     Accept the MatterZero invitation
   </a>
   ```

6. Start the monorepo with `pnpm dev`, open `http://localhost:3000/login` (marketing is at `http://localhost:3000`), and request a link for an invited user. Open the newest email link in the same browser. For admin access, enroll an authenticator-app TOTP factor and verify that `/admin` requires the second factor before showing the invitation form.
7. Apply `supabase/migrations/20261008000000_pilot_access_and_requests.sql` to create `access_grants` and `pilot_requests`. Apply `supabase/migrations/20261009000000_pilot_request_unique_email.sql` after the bootstrap migration to enforce one request per email across all review statuses. If existing duplicates are found, review and resolve them before retrying. Public callers can only insert a work email and organization into the request table. The database does not grant public read access to either table.
8. Set `DATABASE_URL` to the Supabase transaction-pooler connection string in `apps/site/.env.local`. After applying the existing migration, run `pnpm --filter @matterzero/site db:baseline` once for each database environment. This introspects the existing schema and records it as Drizzle's starting point; it does not apply the baseline DDL a second time.

## Auth implementation

- `@supabase/ssr` stores the session in cookies for the Next.js App Router.
- The browser client requests a magic link with `shouldCreateUser: false`; the login form does not create accounts.
- `/auth/confirm` exchanges the default PKCE code or presents a non-consuming confirmation screen for custom token-hash links. `/auth/confirm/verify` verifies token-hash links only after an explicit POST.
- `proxy.ts` refreshes the cookie session and protects `/auth/complete`; the page independently checks verified claims.
- Before requesting a sign-in link, the sign-in UI checks `access_grants` on the server. An email without a grant sees an explanation and a link to request a pilot.
- For the current pilot, use the Vercel project domain `matterzero.vercel.app` for every route. Set `NEXT_PUBLIC_SITE_URL` to `https://matterzero.vercel.app` in Vercel Production, and allow `https://matterzero.vercel.app/auth/confirm` in Supabase Auth. Use `/` for marketing, `/login` for sign-in, `/admin` for admins, and `/dashboard` for pilot team members once that dashboard route is implemented. A custom app subdomain can be added later if MatterZero purchases a domain.

## Single-admin pilot invitations

- `MATTERZERO_ADMIN_EMAIL` is the allowlisted admin. Only that authenticated account can access `/admin`.
- The admin must enroll an authenticator-app TOTP factor. Both `/admin` and the invitation API require a verified AAL2 session; hiding the page is not the security boundary.
- `SUPABASE_SECRET_KEY` is used only by a server-side invitation route. It must not be exposed to the browser or committed.
- Drizzle ORM is the typed server-side Postgres layer for application data. Supabase JS remains responsible for Auth and the public pilot-request insert, which is constrained by Postgres RLS. Server-side Drizzle queries use `DATABASE_URL`; never prefix it with `NEXT_PUBLIC_`. This connection uses a privileged database role that may bypass RLS, so use Drizzle only in server code after the route or page performs its authorization checks.
- `apps/site/src/lib/db/schema.ts` models `access_grants` and `pilot_requests`, including their checks, indexes, unique email constraint, and pilot-request insert policy. Keep it aligned with the SQL migrations. Once `db:baseline` has been run, generate schema changes with `pnpm --filter @matterzero/site db:generate`; generated migrations and snapshots live under `supabase/drizzle`. Review generated SQL and add required `GRANT`/`REVOKE` statements, which are not modeled in the TypeScript schema. Apply generated migrations with `pnpm --filter @matterzero/site db:migrate`. The existing `supabase/migrations` SQL file is the bootstrap migration for this auth milestone; do not apply Drizzle's baseline DDL a second time.
- Use the Supabase transaction-pooler connection string for Vercel. The Drizzle Postgres.js client disables prepared statements for compatibility with transaction pooling and limits each serverless instance to one connection.
- After MFA, the admin dashboard provides invitation and pilot-request review routes. Invitations create an email-based `access_grants` record before asking Supabase Auth to send the invitation. Approving a request records the approval and grant in one database transaction, then sends the invite; if email delivery fails, the admin can retry from Invitations. Declining records the decision without creating an account or grant.
- Pilot requests store only the submitter's work email and organization. Do not add applicant documents or case details to this flow.
- `pilot_requests` is write-only for public `anon` and `authenticated` roles under RLS. Admin reads and updates use server-only Drizzle queries after the allowlisted admin and AAL2 checks. The Supabase service key is used only for Auth invitation calls. The request and access-grant tables are separate from Supabase Auth users.
- Test unauthorized email access, missing MFA, missing secret-key configuration, malformed invite emails, and a successful invitation. Keep a secure recovery method for the authenticator factor.

Before adding applicant records, implement team membership and tested Postgres Row Level Security policies. Authentication proves who signed in; the email grant in this milestone only controls pilot sign-in and does not authorize access to any team's cases.
