create extension if not exists pg_cron with schema pg_catalog;

do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'matterzero-clean-expired-import-batches'
  ) then
    perform cron.schedule(
      'matterzero-clean-expired-import-batches',
      '*/5 * * * *',
      'delete from public.import_batches where expires_at <= now()'
    );
  end if;
end;
$$;
