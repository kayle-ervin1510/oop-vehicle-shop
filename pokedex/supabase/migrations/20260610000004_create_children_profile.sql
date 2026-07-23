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
