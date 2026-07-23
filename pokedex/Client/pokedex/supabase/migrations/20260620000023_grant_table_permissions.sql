-- Grant table-level permissions to Supabase roles.
-- RLS policies alone are not enough — the role must also have GRANT access.
-- anon: read-only for pre-auth lookups (none needed directly; handled by SECURITY DEFINER RPCs).
-- authenticated: full CRUD so the app can read/write its own data after login.
-- service_role: bypasses RLS entirely; used by admin/server-side operations.

GRANT SELECT, INSERT, UPDATE, DELETE ON public."Users"               TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Parent_Profile"      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Children_Profile"    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."App_Restrictions"    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Time_Restricted_Apps" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Time_Unlimited_Apps"  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Unauthorized_Apps"    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Connected_Devices"   TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."Users"               TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Parent_Profile"      TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Children_Profile"    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."App_Restrictions"    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Time_Restricted_Apps" TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Time_Unlimited_Apps"  TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Unauthorized_Apps"    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Connected_Devices"   TO service_role;
