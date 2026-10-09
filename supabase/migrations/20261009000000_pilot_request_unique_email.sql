-- Keep one pilot-request record per email across every review status.
-- Fail before changing indexes if historical duplicates need an explicit review.
do $$
begin
  if exists (
    select 1
    from public.pilot_requests
    group by email
    having count(*) > 1
  ) then
    raise exception 'pilot_requests contains duplicate emails; resolve them before enforcing uniqueness';
  end if;
end;
$$;

drop index if exists public.pilot_requests_one_pending_per_email_idx;
create unique index pilot_requests_email_unique_idx
  on public.pilot_requests (email);
