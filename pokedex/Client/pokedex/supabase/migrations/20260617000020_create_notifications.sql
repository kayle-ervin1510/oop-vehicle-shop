create table if not exists public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null,
  message    text        not null,
  payload    jsonb       not null default '{}',
  read       boolean     not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
