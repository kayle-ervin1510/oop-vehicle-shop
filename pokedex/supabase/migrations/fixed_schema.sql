-- ============================================================
-- TABLE 1: Users
-- Core account identity. Passwords are handled by Supabase auth.
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
-- TABLE 2: Parent_Profile
-- One parent profile per user. child_id is UNIQUE so the FK
-- from Children_Profile can reference it.
-- ============================================================
CREATE TABLE "Parent_Profile" (
    "id"             UUID   NOT NULL DEFAULT gen_random_uuid(),
    "preferred_name" VARCHAR(200) NOT NULL,
    "activity_log"   BIGINT NOT NULL DEFAULT 0,
    "user_id"        UUID   NOT NULL,
    "child_id"       UUID   NOT NULL UNIQUE
);
ALTER TABLE "Parent_Profile" ADD PRIMARY KEY ("id");
ALTER TABLE "Parent_Profile"
    ADD CONSTRAINT "parent_profile_user_id_foreign"
    FOREIGN KEY ("user_id") REFERENCES "Users" ("id");


-- ============================================================
-- TABLE 3: Connected_Devices
-- Devices associated with a child. Device_name is UNIQUE
-- so a device can't be registered twice.
-- ============================================================
CREATE TABLE "Connected_Devices" (
    "Device_id"   UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Device_name" VARCHAR(200) NOT NULL UNIQUE
);
ALTER TABLE "Connected_Devices" ADD PRIMARY KEY ("Device_id");


-- ============================================================
-- TABLE 4: Children_Profile
-- The child's profile. Links back to the parent via child_id.
-- Time columns are TIME (clock windows), not TIMESTAMP.
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
-- TABLE 5: App_Restrictions
-- Per-app rules for a child: allowed or blocked, with an
-- optional daily minute cap.
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
