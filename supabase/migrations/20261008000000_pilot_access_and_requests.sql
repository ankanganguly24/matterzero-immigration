create table if not exists public.access_grants (
  email text primary key,
  granted_at timestamptz not null default now(),
  granted_by text not null,
  constraint access_grants_email_normalized check (email = lower(btrim(email))),
  constraint access_grants_email_length check (char_length(email) between 3 and 254)
);

create table if not exists public.pilot_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  organization text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  constraint pilot_requests_email_normalized check (email = lower(btrim(email))),
  constraint pilot_requests_email_length check (char_length(email) between 3 and 254),
  constraint pilot_requests_organization_length check (char_length(btrim(organization)) between 1 and 120),
  constraint pilot_requests_review_fields check (
    (status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null and reviewed_by is not null)
  )
);

create index if not exists pilot_requests_status_created_at_idx
  on public.pilot_requests (status, created_at desc);
create unique index if not exists pilot_requests_one_pending_per_email_idx
  on public.pilot_requests (email) where status = 'pending';

alter table public.access_grants enable row level security;
alter table public.pilot_requests enable row level security;

-- Public callers can submit, but cannot read requests or access grants.
revoke all on public.access_grants from anon, authenticated;
revoke all on public.pilot_requests from anon, authenticated;
grant insert (email, organization) on public.pilot_requests to anon, authenticated;

create policy "Public can submit minimal pilot requests"
  on public.pilot_requests
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and reviewed_at is null
    and reviewed_by is null
    and email = lower(btrim(email))
    and char_length(email) between 3 and 254
    and char_length(btrim(organization)) between 1 and 120
  );
