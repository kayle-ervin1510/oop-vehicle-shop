-- Restores all RLS policies dropped when RLS was toggled off via the Supabase Dashboard.
-- Uses DROP POLICY IF EXISTS before CREATE to be idempotent.

-- Users
DROP POLICY IF EXISTS "users_own_row" ON public."Users";
CREATE POLICY "users_own_row" ON public."Users"
  FOR ALL USING (auth.uid() = id);

-- Parent_Profile
DROP POLICY IF EXISTS "parent_own_profile" ON public."Parent_Profile";
CREATE POLICY "parent_own_profile" ON public."Parent_Profile"
  FOR ALL USING (auth.uid() = user_id);

-- Children_Profile
DROP POLICY IF EXISTS "parent_own_children" ON public."Children_Profile";
CREATE POLICY "parent_own_children" ON public."Children_Profile"
  FOR ALL USING (
    child_id IN (
      SELECT child_id FROM public."Parent_Profile"
      WHERE user_id = auth.uid()
    )
  );

-- Connected_Devices
DROP POLICY IF EXISTS "parent_own_devices" ON public."Connected_Devices";
CREATE POLICY "parent_own_devices" ON public."Connected_Devices"
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public."Children_Profile"
      WHERE child_id IN (
        SELECT child_id FROM public."Parent_Profile"
        WHERE user_id = auth.uid()
      )
    )
  );

-- App_Restrictions
DROP POLICY IF EXISTS "parent_own_app_restrictions" ON public."App_Restrictions";
CREATE POLICY "parent_own_app_restrictions" ON public."App_Restrictions"
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public."Children_Profile"
      WHERE child_id IN (
        SELECT child_id FROM public."Parent_Profile"
        WHERE user_id = auth.uid()
      )
    )
  );

-- Time_Restricted_Apps
DROP POLICY IF EXISTS "parent_own_time_restricted_apps" ON public."Time_Restricted_Apps";
CREATE POLICY "parent_own_time_restricted_apps" ON public."Time_Restricted_Apps"
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public."Children_Profile"
      WHERE child_id IN (
        SELECT child_id FROM public."Parent_Profile"
        WHERE user_id = auth.uid()
      )
    )
  );

-- Time_Unlimited_Apps
DROP POLICY IF EXISTS "parent_own_time_unlimited_apps" ON public."Time_Unlimited_Apps";
CREATE POLICY "parent_own_time_unlimited_apps" ON public."Time_Unlimited_Apps"
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public."Children_Profile"
      WHERE child_id IN (
        SELECT child_id FROM public."Parent_Profile"
        WHERE user_id = auth.uid()
      )
    )
  );

-- Unauthorized_Apps
DROP POLICY IF EXISTS "parent_own_unauthorized_apps" ON public."Unauthorized_Apps";
CREATE POLICY "parent_own_unauthorized_apps" ON public."Unauthorized_Apps"
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public."Children_Profile"
      WHERE child_id IN (
        SELECT child_id FROM public."Parent_Profile"
        WHERE user_id = auth.uid()
      )
    )
  );

-- Signal PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
