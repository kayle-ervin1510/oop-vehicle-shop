CREATE TABLE "Time_Unlimited_Apps" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id"   UUID         NOT NULL,
    "app_name"   VARCHAR(200) NOT NULL
);
ALTER TABLE "Time_Unlimited_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Time_Unlimited_Apps"
    ADD CONSTRAINT "time_unlimited_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");
