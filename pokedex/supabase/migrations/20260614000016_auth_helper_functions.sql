-- Allows unauthenticated callers to resolve a username to its email.
-- Used by the login form to support username-based login before a JWT exists.
-- SECURITY DEFINER bypasses RLS for this single read; only email is exposed.
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public."Users" WHERE username = p_username LIMIT 1;
$$;

-- Allows an authenticated user to delete their own auth.users entry.
-- ON DELETE CASCADE propagates the deletion to public.Users and all child data.
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
