-- Automatically creates a public.Users row when a new auth.users row is inserted.
-- Metadata (first_name, preferred_name, username) must be passed via
-- supabase.auth.signUp({ options: { data: { ... } } }) on the client.
-- Uses SECURITY DEFINER so it runs as the function owner regardless of the
-- caller's role — needed because the trigger fires inside auth schema context.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only insert if the app-required metadata is present.
  -- Admin-created users (no metadata) are skipped gracefully.
  IF NEW.raw_user_meta_data->>'username' IS NOT NULL
     AND NEW.raw_user_meta_data->>'first_name' IS NOT NULL
  THEN
    INSERT INTO public."Users" (id, first_name, preferred_name, username, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'preferred_name', ''),
        NEW.raw_user_meta_data->>'first_name'
      ),
      NEW.raw_user_meta_data->>'username',
      NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
