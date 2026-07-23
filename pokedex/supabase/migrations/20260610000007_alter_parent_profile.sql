ALTER TABLE "Parent_Profile" ADD COLUMN "screen_time" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Parent_Profile" ADD COLUMN "child_screen_time" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Parent_Profile" ADD COLUMN "Delete_Account" TIMESTAMPTZ;
