# MatterZero staff authentication setup

This phase adds invite-only email magic-link authentication. It does not include a dashboard, team membership model, applicant data, or a database authorization model for case records.

## Configure a Supabase project

1. Create a Supabase project and copy the project URL and publishable key from the project Connect dialog.
2. Copy `.env.example` to `apps/site/.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. These are the browser-safe project URL and publishable key; never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable.
3. In Supabase Auth, enable email sign-in and disable public sign-ups. Invite staff from the Supabase dashboard for this first auth-only milestone.
4. Add the exact local and production callback URLs to Supabase's redirect URL allow list, including `/auth/confirm`. The sign-in form passes the current app's callback as `emailRedirectTo`, so the Magic Link template uses `{{ .RedirectTo }}` to support both local and production origins.
5. Update the Supabase **Magic Link** email template to pass its one-time token hash to the callback. The application supplies `/auth/confirm` as `emailRedirectTo`:

   ```html
   <h2>Sign in to MatterZero</h2>
   <p>Use this secure link to access your invited team account:</p>
   <p>
     <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=email"
       >Sign in to MatterZero</a
     >
   </p>
   ```

   For the **Invite user** template, use the configured Site URL explicitly because dashboard invitations may not include a per-invite redirect URL:

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=invite">
     Accept the MatterZero invitation
   </a>
   ```

   Both links open a confirmation page first. The page does not consume the one-time token on `GET`; it verifies the token only after the user presses **Confirm and sign in**. The callback then redirects to the fixed `/auth/complete` path.

6. Run `pnpm dev`, open `/login`, request a link for an invited user, and confirm that the email opens the confirmation screen. Press **Confirm and sign in** and verify that it opens `/auth/complete`. Also test a dashboard-issued invite, sign-out, and that `/auth/complete` redirects to `/login` afterward.

## Auth implementation

- `@supabase/ssr` stores the session in cookies for the Next.js App Router.
- The browser client requests a magic link with `shouldCreateUser: false`, so the form does not create new accounts.
- `/auth/confirm` is a non-consuming confirmation screen; `/auth/confirm/verify` verifies Supabase's one-time token hash only on an explicit POST.
- `proxy.ts` refreshes the cookie session and protects `/auth/complete`; the page independently checks verified claims.
- The UI returns a generic success message to avoid confirming whether an email belongs to an account.

Before adding applicant records, implement team membership and tested Postgres Row Level Security policies. Authentication proves who signed in; it does not by itself authorize access to any team's cases.
