create table if not exists public.meter_error_logs (
  id             uuid        primary key default gen_random_uuid(),
  stripe_event_id text       unique not null,
  meter_id        text       not null,
  meter_url       text,
  occurred_at     timestamptz not null,
  created_at      timestamptz not null default now()
);

alter table public.meter_error_logs enable row level security;
