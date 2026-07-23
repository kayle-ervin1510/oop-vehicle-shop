-- Restores auth helper functions that were dropped from the remote database.
-- get_email_by_username: resolves a username to its email before a JWT exists (pre-auth).
-- delete_user_account: lets an authenticated user delete their own auth.users row (cascades to public.Users).

CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public."Users" WHERE username = p_username LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Restore the on_auth_user_created trigger and its function in case they were also dropped.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
