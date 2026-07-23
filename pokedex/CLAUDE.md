# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev commands

Frontend (run from `Client/`):
```bash
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # production build → dist/
npm run lint       # ESLint
```

No test runner is configured. Playwright is installed but no test files exist yet.

## What this project is

**Zap App** — a parental screen-time management application. Parents register, add child profiles, and configure per-app restrictions (time-restricted, time-unlimited, unauthorized). The repo is split into two workspaces:

- `Client/` — React + Vite SPA (see `Client/CLAUDE.md` for frontend-specific guidance)
- `supabase/` — Supabase project: local config, migrations, and reference SQL

## Supabase commands

All Supabase CLI commands are run via `npx` from the `supabase/` directory (or project root with `--project-dir supabase`).

```bash
npx supabase start               # start local Supabase stack (Docker required)
npx supabase stop                # stop local stack
npx supabase db reset            # reset local DB and re-run all migrations
npx supabase migration new <name> # scaffold a new migration file
npx supabase db push             # push local migrations to the linked remote project
npx supabase link --project-ref <ref>  # link to a remote Supabase project
npx supabase status              # show local service URLs and keys
```

Local service URLs after `supabase start`:
- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- DB: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## Database schema

Tables and foreign-key relationships:

```
Users (id = auth.users.id)
  └─ Parent_Profile (user_id → Users.id)
       └─ Children_Profile (child_id → Parent_Profile.child_id)
            ├─ App_Restrictions       (child_id → Children_Profile.id)
            ├─ Time_Restricted_Apps   (child_id → Children_Profile.id)
            ├─ Time_Unlimited_Apps    (child_id → Children_Profile.id)
            ├─ Unauthorized_Apps      (child_id → Children_Profile.id)
            └─ Connected_Devices      (child_id → Children_Profile.id)
```

`App_Restrictions` tracks `is_allowed`, `daily_limit_minutes`, `require_password`, and `require_email`. The three `*_Apps` tables (Time_Restricted, Time_Unlimited, Unauthorized) mirror the three app-list categories shown in the UI and point to the same child via `child_id`.

The authoritative current schema is `supabase/reference/curr_db_schema.sql`. Migrations live in `supabase/migrations/` and are applied in timestamp order.

## Migration conventions

- One concern per migration file (create table, alter table, etc.)
- Filename format: `YYYYMMDDHHmmss_<description>.sql`
- Never edit an already-applied migration; write a new `ALTER` migration instead.
- `fixed_schema.sql` and `reference/testing_schema.sql` are reference/planning documents, not runnable migrations.

## Auth model

Auth uses **Supabase Auth** (`auth.users`) linked to the custom `public.Users` table via `id`. RLS is enabled on all tables (migrations `20260614000014`–`20260614000016`). All RLS policies enforce parent-only access: each parent can read/write only their own data, their children, and their children's apps/devices.

Pre-auth lookups (e.g. username-to-email resolution for login) use `SECURITY DEFINER` RPC functions that bypass RLS:
- `get_email_by_username(p_username)` — resolves a username to an email before `signInWithPassword`
- `delete_user_account()` — deletes the `auth.users` row, cascading to `public.Users`

## Environment variables (Client)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project REST URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |

Place these in `Client/.env` (not committed). Both must be `VITE_`-prefixed for Vite to expose them.

## Planning docs

`Client/skeletor/` holds early design artifacts (UI wireframe prompts, style guide, app guide). These are planning documents only — not runnable code. `supabase/Schema.md` is an early draft schema; treat `supabase/reference/curr_db_schema.sql` as authoritative.
