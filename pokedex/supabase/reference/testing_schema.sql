CREATE TABLE "Users"(
    "id" UUID NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "preferfed_name" VARCHAR(200) NOT NULL,
    "username" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "child_name" VARCHAR(200) NOT NULL,
    "user_id" UUID NOT NULL
);
ALTER TABLE
    "Users" ADD PRIMARY KEY("id");
CREATE TABLE "Child(ren)_Profile"(
    "id" UUID NOT NULL,
    "Time_Restricted" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "Time_Unlimited" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL,
        "Unauthorized" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL,
        "Connected_Devices" VARCHAR(200) NOT NULL,
        "child_id" UUID NOT NULL,
        "child_name" VARCHAR(200) NOT NULL,
        "screen_time_goal" BOOLEAN NOT NULL,
        "child_screen_time" INTEGER NOT NULL,
        "Remove_child" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "Child(ren)_Profile" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Child(ren)_Profile"."Time_Restricted" IS 'Upon selection';
COMMENT
ON COLUMN
    "Child(ren)_Profile"."Time_Unlimited" IS 'Upon selection';
COMMENT
ON COLUMN
    "Child(ren)_Profile"."Unauthorized" IS 'Upon selection';
COMMENT
ON COLUMN
    "Child(ren)_Profile"."screen_time_goal" IS 'True or False depending on if screen time meets the screen time goal';
CREATE TABLE "Parent_Profile"(
    "id" UUID NOT NULL,
    "preferred_name" VARCHAR(200) NOT NULL,
    "activity_log" BIGINT NOT NULL,
    "child_name" VARCHAR(200) NOT NULL,
    "user_id" UUID NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "username" VARCHAR(200) NOT NULL,
    "child_id" UUID NOT NULL,
    "screen_time" INTEGER NOT NULL,
    "child_screen_time" INTEGER NOT NULL,
    "Delete_Account" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "Parent_Profile" ADD PRIMARY KEY("id");
CREATE TABLE "Connected_Devices"(
    "Device_id" UUID NOT NULL,
    "Device_name" VARCHAR(200) NOT NULL,
    "Remove_Device" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "Add_Device" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "Connected_Devices" ADD PRIMARY KEY("Device_id");
COMMENT
ON COLUMN
    "Connected_Devices"."Add_Device" IS 'user can type app name after clicking add device';
CREATE TABLE "Time-Restricted-Apps"(
    "id" UUID NOT NULL,
    "Add_App" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "Remove_App" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL,
        "Edit_Time" INTEGER NOT NULL
);
ALTER TABLE
    "Time-Restricted-Apps" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Time-Restricted-Apps"."Add_App" IS 'user can type app name into search engine';
COMMENT
ON COLUMN
    "Time-Restricted-Apps"."Remove_App" IS 'user can type app name into search engine';
CREATE TABLE "Unauthorized_Apps"(
    "id" UUID NOT NULL,
    "Add_App" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "Remove_App" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "Unauthorized_Apps" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Unauthorized_Apps"."Add_App" IS 'user can type app name into search engine';
COMMENT
ON COLUMN
    "Unauthorized_Apps"."Remove_App" IS 'user can type app name into search engine';
CREATE TABLE "Time_Unlimited_Apps"(
    "id" UUID NOT NULL,
    "Add_App" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "Remove_App" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "Time_Unlimited_Apps" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Time_Unlimited_Apps"."Add_App" IS 'user can type app name in search engine';
COMMENT
ON COLUMN
    "Time_Unlimited_Apps"."Remove_App" IS 'user can type app name in search engine';
ALTER TABLE
    "Unauthorized_Apps" ADD CONSTRAINT "unauthorized_apps_id_foreign" FOREIGN KEY("id") REFERENCES "Child(ren)_Profile"("id");
ALTER TABLE
    "Child(ren)_Profile" ADD CONSTRAINT "child(ren)_profile_child_id_foreign" FOREIGN KEY("child_id") REFERENCES "Parent_Profile"("child_id");
ALTER TABLE
    "Child(ren)_Profile" ADD CONSTRAINT "child(ren)_profile_connected_devices_foreign" FOREIGN KEY("Connected_Devices") REFERENCES "Connected_Devices"("Device_name");
ALTER TABLE
    "Time_Unlimited_Apps" ADD CONSTRAINT "time_unlimited_apps_id_foreign" FOREIGN KEY("id") REFERENCES "Child(ren)_Profile"("id");
ALTER TABLE
    "Parent_Profile" ADD CONSTRAINT "parent_profile_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "Users"("user_id");
ALTER TABLE
    "Time-Restricted-Apps" ADD CONSTRAINT "time_restricted_apps_id_foreign" FOREIGN KEY("id") REFERENCES "Child(ren)_Profile"("id");