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
