CREATE TABLE "Time_Restricted_Apps" (
    "id"                  UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id"            UUID         NOT NULL,
    "app_name"            VARCHAR(200) NOT NULL,
    "Edit_Time"           INTEGER      NOT NULL DEFAULT 0
);
ALTER TABLE "Time_Restricted_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Time_Restricted_Apps"
    ADD CONSTRAINT "time_restricted_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");
