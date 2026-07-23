-- Remove test data whose UUIDs have no matching row in auth.users
DELETE FROM public."Users";

-- Drop plaintext password — credentials are now owned by Supabase Auth
ALTER TABLE public."Users" DROP COLUMN IF EXISTS password;

-- Bind public.Users.id to auth.users.id so auth.uid() resolves to the correct profile row
ALTER TABLE public."Users"
  ADD CONSTRAINT users_id_auth_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on Users
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
