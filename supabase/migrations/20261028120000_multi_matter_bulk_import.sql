alter table public.workspace_members
  drop constraint if exists workspace_members_role_check;

alter table public.workspace_members
  add constraint workspace_members_role_check
  check (role in ('owner', 'admin', 'attorney', 'paralegal', 'member'));

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  total_rows integer not null check (total_rows between 1 and 500),
  result jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  completed_at timestamptz,
  check (
    (status = 'pending' and completed_at is null)
    or (status = 'completed' and completed_at is not null and result is not null)
  )
);

create index import_batches_workspace_expiry_idx
  on public.import_batches (workspace_id, expires_at);

create table public.import_batch_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null check (row_number between 2 and 501),
  raw_data jsonb not null,
  errors text[] not null default '{}',
  is_duplicate boolean not null default false,
  action text not null check (action in ('create', 'skip', 'invalid')),
  unique (batch_id, row_number),
  check (
    (cardinality(errors) > 0 and action = 'invalid')
    or (cardinality(errors) = 0 and action in ('create', 'skip'))
  )
);

create index import_batch_rows_batch_idx on public.import_batch_rows (batch_id);

create table public.matters (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 100),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 100),
  email text not null check (
    email = lower(btrim(email)) and char_length(email) between 3 and 254
  ),
  petition_type text not null check (char_length(btrim(petition_type)) between 1 and 40),
  sponsor_employer text not null default '' check (char_length(sponsor_employer) <= 160),
  field_of_endeavor text not null default '' check (char_length(field_of_endeavor) <= 240),
  status text not null default 'intake'
    check (status in ('intake', 'parsing', 'conflict_flagged', 'ready_for_export')),
  assigned_attorney_user_id uuid references auth.users(id) on delete set null,
  import_batch_row_id uuid references public.import_batch_rows(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index matters_import_batch_row_unique_idx
  on public.matters (import_batch_row_id)
  where import_batch_row_id is not null;
create index matters_workspace_updated_idx
  on public.matters (workspace_id, updated_at desc);
create index matters_workspace_status_idx
  on public.matters (workspace_id, status);
create index matters_workspace_duplicate_lookup_idx
  on public.matters (
    workspace_id,
    lower(btrim(email)),
    upper(btrim(petition_type)),
    lower(btrim(sponsor_employer))
  );

alter table public.matters enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_batch_rows enable row level security;

revoke all on public.matters, public.import_batches, public.import_batch_rows from anon;
revoke all on public.matters, public.import_batches, public.import_batch_rows from authenticated;
grant select, insert on public.matters to authenticated;
grant select on public.import_batches, public.import_batch_rows to authenticated;

create policy "Workspace staff can read matters"
  on public.matters for select to authenticated
  using (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = matters.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney', 'paralegal')
    )
  );

create policy "Workspace attorneys can create matters"
  on public.matters for insert to authenticated
  with check (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = matters.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
    and created_by = (select auth.uid())
    and status = 'intake'
    and assigned_attorney_user_id is null
  );

create policy "Workspace importers can read import batches"
  on public.import_batches for select to authenticated
  using (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = import_batches.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
    and status = 'pending'
    and expires_at > now()
  );

create policy "Workspace importers can create import batches"
  on public.import_batches for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = import_batches.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  );

create policy "Workspace importers can update import batches"
  on public.import_batches for update to authenticated
  using (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = import_batches.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  )
  with check (
    exists (
      select 1 from public.workspace_members as member
      where member.workspace_id = import_batches.workspace_id
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  );

create policy "Workspace importers can read staged rows"
  on public.import_batch_rows for select to authenticated
  using (
    exists (
      select 1 from public.import_batches as batch
      join public.workspace_members as member on member.workspace_id = batch.workspace_id
      where batch.id = import_batch_rows.batch_id
        and batch.status = 'pending'
        and batch.expires_at > now()
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  );

create policy "Workspace importers can create staged rows"
  on public.import_batch_rows for insert to authenticated
  with check (
    exists (
      select 1 from public.import_batches as batch
      join public.workspace_members as member on member.workspace_id = batch.workspace_id
      where batch.id = import_batch_rows.batch_id
        and batch.status = 'pending'
        and batch.expires_at > now()
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  );

create policy "Workspace importers can update staged rows"
  on public.import_batch_rows for update to authenticated
  using (
    exists (
      select 1 from public.import_batches as batch
      join public.workspace_members as member on member.workspace_id = batch.workspace_id
      where batch.id = import_batch_rows.batch_id
        and batch.status = 'pending'
        and batch.expires_at > now()
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  )
  with check (
    exists (
      select 1 from public.import_batches as batch
      join public.workspace_members as member on member.workspace_id = batch.workspace_id
      where batch.id = import_batch_rows.batch_id
        and batch.status = 'pending'
        and member.user_id = (select auth.uid())
        and member.role in ('owner', 'admin', 'attorney')
    )
  );
