CREATE TABLE "Connected_Devices" (
    "Device_id"   UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Device_name" VARCHAR(200) NOT NULL UNIQUE
);
ALTER TABLE "Connected_Devices" ADD PRIMARY KEY ("Device_id");
