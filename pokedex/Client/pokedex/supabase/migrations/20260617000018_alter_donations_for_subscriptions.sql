-- Setup intents (subscriptions) have no charge amount at creation time and use a
-- different Stripe ID than payment intents. Make both ID columns nullable and
-- enforce that at least one is always present.

alter table public.donations
  alter column stripe_payment_intent_id drop not null,
  alter column amount set default 0,
  add column stripe_setup_intent_id text unique,
  drop constraint donations_status_check,
  add constraint donations_status_check
    check (status in ('succeeded', 'failed', 'pending')),
  add constraint donations_has_stripe_id
    check (
      stripe_payment_intent_id is not null or
      stripe_setup_intent_id   is not null
    );
