import axios from 'axios'
import { supabase } from '../lib/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL + '/rest/v1',
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
})

// Inject the current session JWT so RLS policies can identify the caller.
// Falls back to the anon key for unauthenticated requests (e.g. pre-login lookups
// that use SECURITY DEFINER functions instead of direct table access).
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  config.headers.Authorization = session?.access_token
    ? `Bearer ${session.access_token}`
    : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  return config
})

export default api
