-- ============================================================
-- full_schema.sql
-- Combined schema — all migrations applied in order.
-- WARNING: This file is for reference only. Use individual
-- migration files for applying changes via the Supabase CLI.
-- ============================================================

-- ============================================================
-- 20260610000001_create_users.sql
-- ============================================================
CREATE TABLE "Users" (
    "id"             UUID         NOT NULL DEFAULT gen_random_uuid(),
    "first_name"     VARCHAR(200) NOT NULL,
    "preferred_name" VARCHAR(200) NOT NULL,
    "username"       VARCHAR(200) NOT NULL UNIQUE,
    "email"          VARCHAR(200) NOT NULL UNIQUE
);
ALTER TABLE "Users" ADD PRIMARY KEY ("id");

-- ============================================================
-- 20260610000002_create_parent_profile.sql
-- ============================================================
CREATE TABLE "Parent_Profile" (
    "id"             UUID         NOT NULL DEFAULT gen_random_uuid(),
    "preferred_name" VARCHAR(200) NOT NULL,
    "activity_log"   BIGINT       NOT NULL DEFAULT 0,
    "user_id"        UUID         NOT NULL,
    "child_id"       UUID         NOT NULL UNIQUE
);
ALTER TABLE "Parent_Profile" ADD PRIMARY KEY ("id");
ALTER TABLE "Parent_Profile"
    ADD CONSTRAINT "parent_profile_user_id_foreign"
    FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

-- ============================================================
-- 20260610000003_create_connected_devices.sql
-- ============================================================
CREATE TABLE "Connected_Devices" (
    "Device_id"   UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Device_name" VARCHAR(200) NOT NULL UNIQUE
);
ALTER TABLE "Connected_Devices" ADD PRIMARY KEY ("Device_id");

-- ============================================================
-- 20260610000004_create_children_profile.sql
-- ============================================================
CREATE TABLE "Children_Profile" (
    "id"               UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_name"       VARCHAR(200) NOT NULL,
    "child_id"         UUID         NOT NULL,
    "Device_id"        UUID,
    "Time_Restricted"  TIME,
    "Time_Unlimited"   TIME,
    "Unauthorized"     TIME,
    "screen_time_goal" BOOLEAN      NOT NULL DEFAULT FALSE,
    "screen_time"      INTEGER      NOT NULL DEFAULT 0
);
ALTER TABLE "Children_Profile" ADD PRIMARY KEY ("id");
COMMENT ON COLUMN "Children_Profile"."Time_Restricted" IS 'Time of day when device enters restricted mode';
COMMENT ON COLUMN "Children_Profile"."Time_Unlimited"  IS 'Time of day when device has unlimited access';
COMMENT ON COLUMN "Children_Profile"."Unauthorized"    IS 'Time of day when device is fully unauthorized';
COMMENT ON COLUMN "Children_Profile"."screen_time_goal" IS 'True if daily screen time is within the set goal';
ALTER TABLE "Children_Profile"
    ADD CONSTRAINT "children_profile_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Parent_Profile" ("child_id");
ALTER TABLE "Children_Profile"
    ADD CONSTRAINT "children_profile_device_id_foreign"
    FOREIGN KEY ("Device_id") REFERENCES "Connected_Devices" ("Device_id");

-- ============================================================
-- 20260610000005_create_app_restrictions.sql
-- ============================================================
CREATE TABLE "App_Restrictions" (
    "id"                  UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id"            UUID         NOT NULL,
    "app_name"            VARCHAR(200) NOT NULL,
    "is_allowed"          BOOLEAN      NOT NULL DEFAULT TRUE,
    "daily_limit_minutes" INTEGER
);
ALTER TABLE "App_Restrictions" ADD PRIMARY KEY ("id");
ALTER TABLE "App_Restrictions"
    ADD CONSTRAINT "app_restrictions_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");

-- ============================================================
-- 20260610000006_alter_children_profile.sql
-- ============================================================
ALTER TABLE "Children_Profile" RENAME COLUMN "screen_time" TO "child_screen_time";
ALTER TABLE "Children_Profile" ADD COLUMN "Remove_child" TIMESTAMPTZ;

-- ============================================================
-- 20260610000007_alter_parent_profile.sql
-- ============================================================
ALTER TABLE "Parent_Profile" ADD COLUMN "screen_time"       INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Parent_Profile" ADD COLUMN "child_screen_time" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Parent_Profile" ADD COLUMN "Delete_Account"    TIMESTAMPTZ;

-- ============================================================
-- 20260610000008_alter_connected_devices.sql
-- ============================================================
ALTER TABLE "Connected_Devices" ADD COLUMN "Remove_Device" TIMESTAMPTZ;
ALTER TABLE "Connected_Devices" ADD COLUMN "Add_Device"    TIMESTAMPTZ;

-- ============================================================
-- 20260610000009_create_time_unlimited_apps.sql
-- ============================================================
CREATE TABLE "Time_Unlimited_Apps" (
    "id"       UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id" UUID         NOT NULL,
    "app_name" VARCHAR(200) NOT NULL
);
ALTER TABLE "Time_Unlimited_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Time_Unlimited_Apps"
    ADD CONSTRAINT "time_unlimited_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");

-- ============================================================
-- 20260610000010_create_unauthorized_apps.sql
-- ============================================================
CREATE TABLE "Unauthorized_Apps" (
    "id"       UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id" UUID         NOT NULL,
    "app_name" VARCHAR(200) NOT NULL
);
ALTER TABLE "Unauthorized_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Unauthorized_Apps"
    ADD CONSTRAINT "unauthorized_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");

-- ============================================================
-- 20260610000011_create_time_restricted_apps.sql
-- ============================================================
CREATE TABLE "Time_Restricted_Apps" (
    "id"        UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id"  UUID         NOT NULL,
    "app_name"  VARCHAR(200) NOT NULL,
    "Edit_Time" INTEGER      NOT NULL DEFAULT 0
);
ALTER TABLE "Time_Restricted_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Time_Restricted_Apps"
    ADD CONSTRAINT "time_restricted_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");

-- ============================================================
-- 20260611000012_users_add_password_disable_rls.sql
-- ============================================================
ALTER TABLE "Users" ADD COLUMN "password" VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE "Users" DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 20260612000001_connected_devices_add_child_id.sql
-- ============================================================
ALTER TABLE public."Connected_Devices"
    ADD COLUMN IF NOT EXISTS child_id uuid
    REFERENCES public."Children_Profile"(id);

-- ============================================================
-- 20260614000013_users_link_auth.sql
-- ============================================================
DELETE FROM public."Users";

ALTER TABLE public."Users" DROP COLUMN IF EXISTS password;

ALTER TABLE public."Users"
    ADD CONSTRAINT users_id_auth_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 20260614000014_enable_rls_all_tables.sql
-- ============================================================
ALTER TABLE public."Parent_Profile"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Children_Profile"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Connected_Devices"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."App_Restrictions"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Time_Restricted_Apps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Time_Unlimited_Apps"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Unauthorized_Apps"    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 20260614000015_rls_policies.sql
-- ============================================================
CREATE POLICY "users_own_row" ON public."Users"
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "parent_own_profile" ON public."Parent_Profile"
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "parent_own_children" ON public."Children_Profile"
    FOR ALL USING (
        child_id IN (
            SELECT child_id FROM public."Parent_Profile"
            WHERE user_id = auth.uid()
        )
    );

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

-- ============================================================
-- 20260614000016_auth_helper_functions.sql
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT email FROM public."Users" WHERE username = p_username LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
