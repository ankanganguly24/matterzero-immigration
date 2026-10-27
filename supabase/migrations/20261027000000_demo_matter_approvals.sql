create table if not exists public.demo_matter_approvals (
  id uuid primary key default gen_random_uuid(),
  matter_id text not null,
  version_hash text not null check (char_length(version_hash) = 64),
  reviewer_id text not null,
  reviewer_email text not null check (char_length(reviewer_email) between 3 and 254),
  approved_at timestamptz not null default now()
);

create unique index if not exists demo_matter_approvals_matter_version_unique_idx
  on public.demo_matter_approvals (matter_id, version_hash);

create index if not exists demo_matter_approvals_matter_approved_at_idx
  on public.demo_matter_approvals (matter_id, approved_at desc);

alter table public.demo_matter_approvals enable row level security;
revoke all on public.demo_matter_approvals from anon, authenticated;

create or replace function public.prevent_demo_matter_approval_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Demo approval records are append-only';
end;
$$;

drop trigger if exists demo_matter_approvals_no_update on public.demo_matter_approvals;
create trigger demo_matter_approvals_no_update
  before update or delete on public.demo_matter_approvals
  for each row execute function public.prevent_demo_matter_approval_mutation();

revoke update, delete, truncate on public.demo_matter_approvals from anon, authenticated;
