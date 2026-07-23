# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

**Zap App** — a parental screen-time management SPA. Parents register, add child profiles, and configure per-app time restrictions (time-restricted, time-unlimited, unauthorized). The backend is a Supabase Postgres project; credentials live in `.env`.

## Commands

```bash
npm run dev        # start Vite dev server (localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the dist/ build locally
npm run lint       # ESLint
```

No test runner is configured yet. Playwright is installed (`playwright` in devDependencies) but no test files exist.

## Architecture

### Routing (`src/App.jsx`)
React Router DOM v7. Two wrapper components gate every route:
- `PublicRoute` — redirects authenticated users to `/dashboard`
- `ProtectedRoute` — redirects unauthenticated users to `/login`

Auth routes (public): `/login`, `/signup`, `/terms`, `/confirm`, `/forgot-password`

Protected routes: `/dashboard`, `/dashboard/new-child`, `/dashboard/:childId/overview` (→ `ScreenTimePage`), `/dashboard/:childId/apps`, `/dashboard/:childId/edit/:appName`, `/contact`, `/profile`, `/biometrics`, `/donate`

Catch-all `*` and root `/` both redirect to `/login`.

`App.jsx` also renders a floating "Buy Me a Milk" button (fixed, bottom-right) that is visible only when `currentUser` is set — it links to `/donate`.

### Global state (`src/context/AppContext.jsx`)
Single React context (`AppContext`) wraps the entire tree. `useApp()` is the only way components access shared state. The context owns:
- `currentUser` — the logged-in `Users` row (or `null`), restored from Supabase Auth session on page load
- `children` — array of child objects loaded from Supabase, each containing `apps`, `devices`, `stoppedApps`, and `screenTimeHistory`
- `activityLog` — in-memory log of parent actions (not persisted)
- `parentScreenTime` / child `screenTimeHistory` — **mock data** hardcoded in the context; no history table exists in the schema
- `loading` / `error` — set/cleared around every async mutation; pages can read these for UI feedback

**Session restoration:** On mount, `AppContext` calls `supabase.auth.getSession()` and sets `initializing = true` until the check resolves. `ProtectedRoute` renders `null` while `initializing` is true to prevent a flash-redirect to `/login` before the session is confirmed. If the fetch fails, the user is left logged out (silent failure).

**Key mutations exported from context:**

| Method | Description |
|---|---|
| `login(usernameOrEmail, password)` | Resolves username → email via `get_email_by_username` RPC, then calls `signInWithPassword` |
| `logout()` | Signs out, clears state, resets `configuredRestrictions` |
| `registerUser(userData)` | Creates `auth.users` + `Users` + `Parent_Profile` rows |
| `resetPassword(email)` | Calls `supabase.auth.resetPasswordForEmail` |
| `changePassword(currentPw, newPw)` | Re-authenticates before calling `updateUser` |
| `updateParentProfile(updates)` | Syncs email changes to both Supabase Auth and the `Users` table |
| `deleteAccount()` | Deletes children rows first, then calls `delete_user_account()` RPC (cascades `auth.users`) |
| `getChild(childId)` | Selector — finds a child in `children` by id |
| `addChild` / `updateChildName(childId, newName)` / `removeChild(childId)` | Child CRUD, updates local `children` array |
| `addApp(childId, listType, appName)` | Adds an app to `time-restricted`, `time-unlimited`, or `unauthorized` list |
| `removeApp(childId, listType, appName)` | Removes an app from a list; also deletes its `App_Restrictions` row |
| `updateAppRestriction(childId, appName, updates)` | Upserts `App_Restrictions` for a time-restricted app |
| `toggleStopApp(childId, appName)` | Toggles app in child's `stoppedApps` set (in-memory only) |
| `setChildGoal(childId, minutes)` | Sets `dailyGoalMinutes` on the in-memory child object (session-only) |
| `logActivity(childName, appName, action)` | Appends to in-memory `activityLog` |

`buildChildObject()` merges `Parent_Profile`, `Children_Profile`, app rows, device rows, and `App_Restrictions` into a single in-memory child object that the UI works with.

`configuredRestrictions` is a `useRef<Set>` storing `"childId:appName"` strings. It controls activity-log phrasing: first call → "You set X's restrictions to…", subsequent calls → "You added an additional…". It resets on logout.

### Transport layer
Two separate transports are used — never mix them:
- **`src/lib/supabase.js`** — Supabase JS client. Used by `AppContext` directly for all Auth operations (`signInWithPassword`, `signOut`, `updateUser`, `resetPasswordForEmail`, `rpc`).
- **`src/services/api.js`** — Axios instance pointed at the Supabase REST endpoint, injects the session JWT on every request. Used by all service files for table CRUD.

### Service layer (`src/services/`)
All table interactions go through domain services — pages and the context never call `api.js` directly:

| File | Responsibility |
|---|---|
| `userService.js` | `createUser`, `findUser`, `fetchUserById`, `findUserByEmail`, `updateUser`, `deleteUser` |
| `childService.js` | `fetchChildren`, `createChild`, `updateChildName`, `deleteChild` |
| `appService.js` | CRUD for `Time_Restricted_Apps`, `Time_Unlimited_Apps`, `Unauthorized_Apps`, and `App_Restrictions` (upsert) |
| `deviceService.js` | `fetchDevicesForChild`, `addDevice`, `removeDevice` |

**Column naming gotcha:** `Time_Restricted_Apps.Edit_Time` stores the daily limit in **minutes** (not a timestamp). Default on create is 60.

### Components
`src/components/Navbar.jsx` is the only shared component. Pages import it directly — there is no layout route wrapping it.

### Pages (`src/pages/`)
One file per route. Pages call `useApp()` for data and mutations; they do not call services directly.

**Page-specific notes:**
- `ManageAppsPage` — contains an internal multi-step `DeviceVerifyFlow` component (`name → method → phone-entry → phone-code | install → done`). Both verification paths (`phone-entry` and `install`) are UI simulations: no SMS is actually sent, and the code check is client-side length validation only. `onAdd(deviceName)` is called directly after the user "confirms."
- `BiometricsPage` — static informational/explainer page. Makes no Supabase calls; biometric auth is not yet implemented. It exists to educate parents about the concept.

### Styling
Global CSS in `src/index.css` and `src/App.css`. Color scheme is derived from the Netflix show *BNA (Brand New Animal)*. CSS custom properties defined in `index.css`: `--bg-primary` (#0a0f1e), `--bg-card` (#111d35), `--accent-orange` (#f0592a), `--accent-teal` (#3ecfcf), `--accent-purple` (#8b5cf6). Fonts: Rajdhani (brand/headings), Inter (body). Shared layout classes: `.page`, `.card`, `.card-wide`, `.step-indicator`, `.step-dot`.

## Known intentional limitations

- `screenTimeHistory` and `parentScreenTime` are hardcoded mock data — no history table exists in the schema.
- `dailyGoalMinutes` on a child is session-only (the schema stores a boolean `screen_time_goal`, not a minute count).
- `activityLog` is in-memory only and resets on page reload.
- `@stripe/react-stripe-js` and `@stripe/stripe-js` are installed but not yet integrated.

## Utility scripts (`scripts/`)

These are Node ESM scripts run directly — not part of the build:

| Script | Usage | Purpose |
|---|---|---|
| `api-verify.mjs` | `TEST_USER=x TEST_PASS=y node scripts/api-verify.mjs` | Calls the Supabase REST API directly (no browser) to verify all newly-wired features. Authenticates first (RLS blocks unauthenticated queries). Reads `.env` automatically. |
| `e2e-test.mjs` | `TEST_USER=x TEST_PASS=y node scripts/e2e-test.mjs` | Playwright browser walkthrough. Requires the dev server running on port 5173. |
| `login-diag.mjs` | `TEST_USER=x TEST_PASS=y node scripts/login-diag.mjs` | Step-by-step diagnosis of the login flow — useful when RLS or the `get_email_by_username` RPC is misbehaving. |
| `fix-rls.mjs` | `node scripts/fix-rls.mjs "postgresql://..."` | Connects directly to Postgres via `pg` and patches RLS policies. Pass the full connection string as the first argument (Supabase → Settings → Database → URI). |

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project REST URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |

Both must be prefixed `VITE_` to be exposed by Vite. Place in `Client/.env` (not committed).
