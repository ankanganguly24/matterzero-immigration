create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  organization_type text not null check (organization_type in ('consultancy', 'law_firm', 'in_house', 'other')),
  market text not null check (market in ('india', 'united_states', 'other')),
  team_size text not null check (team_size in ('1', '2-5', '6-15', '16+')),
  primary_focus text not null check (primary_focus in ('business', 'student', 'family', 'other')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null check (
    email = lower(btrim(email)) and char_length(email) between 3 and 254
  ),
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspaces_created_by_idx on public.workspaces (created_by);
create index if not exists workspace_members_user_id_idx on public.workspace_members (user_id);
create index if not exists workspace_members_email_idx on public.workspace_members (email);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

revoke all on public.workspaces from anon, authenticated;
revoke all on public.workspace_members from anon, authenticated;
grant select on public.workspaces, public.workspace_members to authenticated;

create policy "Workspace members can read their workspaces"
  on public.workspaces for select to authenticated
  using (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = id and member.user_id = (select auth.uid())
    )
  );

create policy "Users can read their own workspace memberships"
  on public.workspace_members for select to authenticated
  using (user_id = (select auth.uid()));
