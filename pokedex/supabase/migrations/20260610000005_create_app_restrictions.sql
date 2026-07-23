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
