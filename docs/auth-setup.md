# MatterZero staff authentication setup

This milestone provides invite-only email magic-link authentication and a small single-admin pilot invitation screen. It does not include a team workspace, applicant data, or authorization for case records.

## Supabase project setup

1. Create a Supabase project and copy its project URL and publishable key.
2. Copy `.env.example` to `apps/site/.env.local` and configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (use `http://localhost:3000` for local admin invites; use the deployed origin for production)
   - `MATTERZERO_ADMIN_EMAIL` (the one administrator email)
   - `SUPABASE_SECRET_KEY` (server-only; never use a `NEXT_PUBLIC_` name)
3. In Supabase Auth, enable email sign-in and disable public sign-ups. Bootstrap the admin by inviting the configured admin email in the Supabase dashboard.
4. In Auth URL Configuration, allow the exact callback URLs `http://localhost:3000/auth/confirm` and `https://matterzero.vercel.app/auth/confirm`. Set the Site URL to the production origin. The sign-in form sends the current app origin as `emailRedirectTo`.
5. The default Supabase Magic Link template uses a PKCE code, which `/auth/confirm` exchanges for a session. Open a link in the same browser where it was requested so the PKCE verifier is available. For dashboard-issued admin invitations, `NEXT_PUBLIC_SITE_URL` determines the redirect origin.

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

6. Start the monorepo with `pnpm dev`, open `http://localhost:3000/login`, and request a link for an invited user. Open the newest email link in the same browser. For admin access, enroll an authenticator-app TOTP factor and verify that `/admin` requires the second factor before showing the invitation form.

## Auth implementation

- `@supabase/ssr` stores the session in cookies for the Next.js App Router.
- The browser client requests a magic link with `shouldCreateUser: false`; the login form does not create accounts.
- `/auth/confirm` exchanges the default PKCE code or presents a non-consuming confirmation screen for custom token-hash links. `/auth/confirm/verify` verifies token-hash links only after an explicit POST.
- `proxy.ts` refreshes the cookie session and protects `/auth/complete`; the page independently checks verified claims.
- The UI returns a generic success message so it does not reveal whether an email belongs to an account. In development, send errors include Supabase's diagnostic message; the rate-limit error has a specific wait-and-retry message.

## Single-admin pilot invitations

- `MATTERZERO_ADMIN_EMAIL` is the allowlisted admin. Only that authenticated account can access `/admin`.
- The admin must enroll an authenticator-app TOTP factor. Both `/admin` and the invitation API require a verified AAL2 session; hiding the page is not the security boundary.
- `SUPABASE_SECRET_KEY` is used only by a server-side invitation route. It must not be exposed to the browser or committed.
- After MFA, the admin can invite pilot teammates. This creates a Supabase Auth invitation only; it does not grant access to applicant or case data.
- Test unauthorized email access, missing MFA, missing secret-key configuration, malformed invite emails, and a successful invitation. Keep a secure recovery method for the authenticator factor.

Before adding applicant records, implement team membership and tested Postgres Row Level Security policies. Authentication proves who signed in; it does not by itself authorize access to any team's cases.
