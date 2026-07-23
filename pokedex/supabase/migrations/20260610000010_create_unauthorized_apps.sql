CREATE TABLE "Unauthorized_Apps" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "child_id"   UUID         NOT NULL,
    "app_name"   VARCHAR(200) NOT NULL
);
ALTER TABLE "Unauthorized_Apps" ADD PRIMARY KEY ("id");
ALTER TABLE "Unauthorized_Apps"
    ADD CONSTRAINT "unauthorized_apps_child_id_foreign"
    FOREIGN KEY ("child_id") REFERENCES "Children_Profile" ("id");
