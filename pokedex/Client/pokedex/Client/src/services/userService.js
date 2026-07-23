import { supabase } from '../lib/supabase'
import api from './api'

export async function createUser({ firstName, preferredName, username, email, password }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        preferred_name: preferredName || firstName,
        username,
      },
    },
  })
  if (authError) throw authError
  // public.Users row is created automatically by the on_auth_user_created trigger
  return authData.user
}

export async function findUser(usernameOrEmail, password) {
  let email = usernameOrEmail

  // Username login: look up the email via a SECURITY DEFINER RPC (bypasses RLS pre-auth)
  if (!usernameOrEmail.includes('@')) {
    const { data: resolvedEmail } = await supabase.rpc('get_email_by_username', {
      p_username: usernameOrEmail,
    })
    if (!resolvedEmail) return null
    email = resolvedEmail
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (!authData.user) return null

  const { data: rows } = await api.get('/Users', { params: { id: `eq.${authData.user.id}` } })
  return rows?.[0] || null
}

export async function fetchUserById(id) {
  const { data } = await api.get('/Users', { params: { id: `eq.${id}` } })
  return data?.[0] || null
}

export async function findUserByEmail(email) {
  const { data } = await api.get('/Users', {
    params: { email: `ilike.${email}` },
  })
  return data?.[0] || null
}

export async function updateUser(id, updates) {
  const { data } = await api.patch(`/Users?id=eq.${id}`, updates)
  return Array.isArray(data) ? data[0] : data
}

export async function deleteUser(id) {
  await api.delete(`/Users?id=eq.${id}`)
}
