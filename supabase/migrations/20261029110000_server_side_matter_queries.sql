create extension if not exists pg_trgm with schema extensions;

do $$
declare
  trigram_schema text;
begin
  select namespace.nspname
    into trigram_schema
  from pg_extension as extension
  join pg_namespace as namespace on namespace.oid = extension.extnamespace
  join pg_opclass as operator_class on operator_class.opcnamespace = namespace.oid
  join pg_am as access_method on access_method.oid = operator_class.opcmethod
  where extension.extname = 'pg_trgm'
    and operator_class.opcname = 'gin_trgm_ops'
    and access_method.amname = 'gin'
  limit 1;

  if trigram_schema is null then
    raise exception 'pg_trgm GIN operator class is unavailable';
  end if;

  execute format(
    'create index if not exists matters_full_name_trgm_idx on public.matters using gin ((first_name || '' '' || last_name) %I.gin_trgm_ops)',
    trigram_schema
  );
  execute format(
    'create index if not exists matters_email_trgm_idx on public.matters using gin (email %I.gin_trgm_ops)',
    trigram_schema
  );
  execute format(
    'create index if not exists matters_petition_trgm_idx on public.matters using gin (petition_type %I.gin_trgm_ops)',
    trigram_schema
  );
end;
$$;

create index if not exists matters_workspace_name_order_idx
  on public.matters (workspace_id, last_name, first_name, id);

create index if not exists matters_workspace_status_updated_idx
  on public.matters (workspace_id, status, updated_at desc, id desc);

create index if not exists matters_workspace_petition_order_idx
  on public.matters (workspace_id, petition_type, last_name, id);

create index if not exists matters_workspace_assignee_order_idx
  on public.matters (workspace_id, assigned_attorney_user_id, updated_at desc, id desc);

create index if not exists matters_workspace_updated_page_idx
  on public.matters (workspace_id, updated_at desc, id desc);
