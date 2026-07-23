# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run all Supabase CLI commands via `npx` from this directory:

```bash
npx supabase start               # start local stack (Docker required)
npx supabase stop
npx supabase db reset            # reset local DB and re-run all migrations
npx supabase migration new <name>
npx supabase db push             # push migrations to the linked remote project
npx supabase status              # show local service URLs and keys
```

Deploy and invoke edge functions locally:

```bash
npx supabase functions serve                        # serve all functions locally
npx supabase functions serve <function-name>        # serve a single function
npx supabase functions deploy <function-name>       # deploy to remote
```

Local service URLs after `supabase start`:

| Service | URL |
|---|---|
| API | `http://127.0.0.1:54321` |
| Studio | `http://127.0.0.1:54323` |
| DB | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| Inbucket (email) | `http://127.0.0.1:54324` |
| Edge Runtime | `http://127.0.0.1:54321/functions/v1/<name>` |

## Migration conventions

- One concern per file (create table, alter table, add policy, etc.)
- Filename format: `YYYYMMDDHHmmss_<description>.sql`
- Never edit an already-applied migration — write a new `ALTER` migration instead.
- `migrations/fixed_schema.sql` and `reference/testing_schema.sql` are reference/planning docs, not runnable.
- Authoritative current schema: `reference/curr_db_schema.sql`

## Schema overview

```
auth.users  ←─ public.Users (id FK → auth.users.id, CASCADE delete)
  └─ Parent_Profile (user_id → Users.id)
       └─ Children_Profile (child_id → Parent_Profile.child_id)
            ├─ App_Restrictions       (child_id → Children_Profile.id)
            ├─ Time_Restricted_Apps   (child_id → Children_Profile.id)
            ├─ Time_Unlimited_Apps    (child_id → Children_Profile.id)
            ├─ Unauthorized_Apps      (child_id → Children_Profile.id)
            └─ Connected_Devices      (child_id → Children_Profile.id)

auth.users ←─ public.donations (user_id FK → auth.users.id, CASCADE delete)
```

RLS is enabled on all tables (migrations `20260614000014`–`20260614000016`). All policies enforce parent-only access via the chain `auth.uid() → Users → Parent_Profile → Children_Profile`.

## Auth design

- `public.Users.id` is bound to `auth.users.id` (FK, ON DELETE CASCADE) — migration `20260614000013`.
- Login is username-based: the client calls `get_email_by_username(p_username)` (a `SECURITY DEFINER` RPC that bypasses RLS) to resolve the username to an email, then calls `signInWithPassword`.
- Account deletion: `delete_user_account()` RPC (`SECURITY DEFINER`) deletes the `auth.users` row; the cascade removes everything downstream.

## Edge functions

All functions are Deno 2, located in `functions/<name>/index.ts`. They use `npm:` specifiers for third-party packages.

| Function | Method | Purpose |
|---|---|---|
| `process-donation` | POST | Creates a Stripe PaymentIntent; returns `client_secret` |
| `stripe-webhook` | POST | Receives Stripe events; records `succeeded`/`failed` in `public.donations` |
| `pokemon-team` | GET | Fetches a random 6-pokemon team by type from PokeAPI |
| `add-numbers` | — | Dev/demo function |
| `multi-numbers` | — | Dev/demo function |
| `hello-world` | — | Dev/demo function |

### Stripe integration

The donations flow requires these secrets set in the edge runtime environment:

| Secret | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | `process-donation`, `stripe-webhook` |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook` (signature verification) |
| `SUPABASE_URL` | `stripe-webhook` |
| `SUPABASE_SERVICE_ROLE_KEY` | `stripe-webhook` (bypasses RLS to insert donation rows) |

Set locally via `.env` file in `functions/<name>/` or via `npx supabase secrets set KEY=value`. The webhook handler is idempotent: it skips insert if a row with the same `stripe_payment_intent_id` already exists.

`process-donation` expects `{ amount: number (cents, 1–1000000), user_id: string }` and a valid `Authorization` header.
