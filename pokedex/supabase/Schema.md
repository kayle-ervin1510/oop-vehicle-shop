CREATE TABLE "Users"(
    "id" UUID NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "prefered_name" VARCHAR(200) NOT NULL,
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
    "Time_Restricted" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "Time_Unlimited" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "Unauthorized" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "Connected_Deviuuidces" VARCHAR(200) NOT NULL,
    "child_id" UUID NOT NULL,
    "child_name" VARCHAR(200) NOT NULL,
    "screen_time_goal" BOOLEAN NOT NULL,
    "screen_time" INTEGER NOT NULL
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
    "prefered_name" VARCHAR(200) NOT NULL,
    "activity_log" BIGINT NOT NULL,
    "child_name" VARCHAR(200) NOT NULL,
    "user_id" UUID NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "username" VARCHAR(200) NOT NULL,
    "child_id" UUID NOT NULL
);
ALTER TABLE
    "Parent_Profile" ADD PRIMARY KEY("id");
CREATE TABLE "Connected_Devices"(
    "Device_id" UUID NOT NULL,
    "Device_name" VARCHAR(200) NOT NULL
);
ALTER TABLE
    "Connected_Devices" ADD PRIMARY KEY("Device_id");
ALTER TABLE
    "Child(ren)_Profile" ADD CONSTRAINT "child(ren)_profile_child_id_foreign" FOREIGN KEY("child_id") REFERENCES "Parent_Profile"("child_id");
ALTER TABLE
    "Child(ren)_Profile" ADD CONSTRAINT "child(ren)_profile_connected_deviuuidces_foreign" FOREIGN KEY("Connected_Deviuuidces") REFERENCES "Connected_Devices"("Device_name");
ALTER TABLE
    "Parent_Profile" ADD CONSTRAINT "parent_profile_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "Users"("user_id");