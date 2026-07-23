-- child_id was present in the remote DB schema but missing from local migrations
ALTER TABLE public."Connected_Devices"
  ADD COLUMN IF NOT EXISTS child_id uuid
  REFERENCES public."Children_Profile"(id);
