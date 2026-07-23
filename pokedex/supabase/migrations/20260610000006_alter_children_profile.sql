ALTER TABLE "Children_Profile" RENAME COLUMN "screen_time" TO "child_screen_time";
ALTER TABLE "Children_Profile" ADD COLUMN "Remove_child" TIMESTAMPTZ;
