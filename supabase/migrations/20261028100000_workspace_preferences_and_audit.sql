alter table public.workspaces
  add column practice_areas text[] not null default '{}',
  add column office_location text not null default '',
  add column deadline_padding_days integer not null default 14,
  add column firm_context text not null default '';

alter table public.workspaces
  add constraint workspaces_practice_areas_count check (cardinality(practice_areas) <= 12),
  add constraint workspaces_office_location_length check (char_length(office_location) <= 160),
  add constraint workspaces_deadline_padding_range check (deadline_padding_days between 0 and 90),
  add constraint workspaces_firm_context_length check (char_length(firm_context) <= 4000);

create table public.workspace_audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_email text not null check (char_length(actor_email) between 3 and 254),
  event_type text not null check (
    event_type in ('workspace.profile_updated', 'workspace.context_updated')
  ),
  changed_fields text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index workspace_audit_events_workspace_occurred_idx
  on public.workspace_audit_events (workspace_id, occurred_at desc);

alter table public.workspace_audit_events enable row level security;
revoke all on public.workspace_audit_events from anon, authenticated;
grant select on public.workspace_audit_events to authenticated;

create policy "Workspace members can read their audit events"
  on public.workspace_audit_events for select to authenticated
  using (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = workspace_audit_events.workspace_id
        and member.user_id = (select auth.uid())
    )
  );

create or replace function public.prevent_workspace_audit_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'Workspace audit events are append-only';
end;
$$;

revoke all on function public.prevent_workspace_audit_mutation() from public, anon, authenticated;

create trigger workspace_audit_events_append_only
  before update or delete on public.workspace_audit_events
  for each row execute function public.prevent_workspace_audit_mutation();
