create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  stripe_payment_intent_id text unique not null,
  status text not null check (status in ('succeeded', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

-- Users can only read their own donation rows
create policy "Users can view own donations"
  on public.donations
  for select
  using (auth.uid() = user_id);
