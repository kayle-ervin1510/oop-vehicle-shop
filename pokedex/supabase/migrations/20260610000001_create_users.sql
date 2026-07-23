CREATE TABLE "Users" (
    "id"             UUID         NOT NULL DEFAULT gen_random_uuid(),
    "first_name"     VARCHAR(200) NOT NULL,
    "preferred_name" VARCHAR(200) NOT NULL,
    "username"       VARCHAR(200) NOT NULL UNIQUE,
    "email"          VARCHAR(200) NOT NULL UNIQUE
);
ALTER TABLE "Users" ADD PRIMARY KEY ("id");
