create table if not exists public.api_rate_limits (
  key text primary key,
  request_count integer not null,
  expires_at timestamptz not null,
  constraint api_rate_limits_key_length check (char_length(key) = 64),
  constraint api_rate_limits_request_count_positive check (request_count > 0)
);

create index if not exists api_rate_limits_expires_at_idx
  on public.api_rate_limits (expires_at);

alter table public.api_rate_limits enable row level security;
revoke all privileges on table public.api_rate_limits from public, anon, authenticated;
