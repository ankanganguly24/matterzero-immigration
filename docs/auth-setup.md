# MatterZero staff authentication setup

This phase adds invite-only email magic-link authentication. It does not include a dashboard, team membership model, applicant data, or a database authorization model for case records.

## Configure a Supabase project

1. Create a Supabase project and copy the project URL and publishable key from the project Connect dialog.
2. Copy `.env.example` to `apps/site/.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. These are the browser-safe project URL and publishable key; never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable.
3. In Supabase Auth, enable email sign-in and disable public sign-ups. Invite staff from the Supabase dashboard for this first auth-only milestone.
4. Set the Supabase Site URL to the local origin during development and add the local and production callback URLs to the redirect URL allow list, including `/auth/confirm`.
5. Update the Supabase **Magic Link** and **Invite user** email templates so each link passes the one-time token hash to the server callback. Use `type=email` in the Magic Link template and `type=invite` in the Invite user template:

   ```html
   <h2>Sign in to MatterZero</h2>
   <p>Use this secure link to access your invited team account:</p>
   <p>
     <a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email"
       >Sign in to MatterZero</a
     >
   </p>
   ```

   For the Invite user template, change the final parameter to `type=invite`. The app requests an `emailRedirectTo` URL ending in `/auth/confirm?next=%2Fauth%2Fcomplete`; the callback validates the token server-side and always redirects to the fixed `/auth/complete` path.

6. Run `pnpm dev`, open `/login`, request a link for an invited user, and confirm that the link opens `/auth/complete`. Test sign-out and verify that `/auth/complete` redirects to `/login` afterward.

## Auth implementation

- `@supabase/ssr` stores the session in cookies for the Next.js App Router.
- The browser client requests a magic link with `shouldCreateUser: false`, so the form does not create new accounts.
- `/auth/confirm` verifies Supabase's one-time token hash server-side.
- `proxy.ts` refreshes the cookie session and protects `/auth/complete`; the page independently checks verified claims.
- The UI returns a generic success message to avoid confirming whether an email belongs to an account.

Before adding applicant records, implement team membership and tested Postgres Row Level Security policies. Authentication proves who signed in; it does not by itself authorize access to any team's cases.
