-- Temporary diagnostic function: returns the UUID that auth.uid() resolves to
-- for the current request's JWT. Used to verify RLS can identify the caller.
-- Safe to leave in place; it exposes nothing beyond what the caller already knows.
CREATE OR REPLACE FUNCTION public.debug_auth_uid()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.uid()::text, 'NULL — no JWT or JWT not decoded');
$$;

GRANT EXECUTE ON FUNCTION public.debug_auth_uid() TO authenticated, anon;
