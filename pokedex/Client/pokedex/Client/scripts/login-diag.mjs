/**
 * Diagnoses exactly which step in the login flow fails with RLS enabled.
 * Run with: TEST_USER=yourUsername TEST_PASS=yourPassword node scripts/login-diag.mjs
 */
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(dir, '../.env'), 'utf8')
const get = key => env.match(new RegExp(`${key}=(.+)`))?.[1]?.trim()

const URL  = get('VITE_SUPABASE_URL')
const ANON = get('VITE_SUPABASE_ANON_KEY')

const TEST_USER = process.env.TEST_USER || ''
const TEST_PASS = process.env.TEST_PASS || ''
if (!TEST_USER || !TEST_PASS) {
  console.error('Usage: TEST_USER=x TEST_PASS=y node scripts/login-diag.mjs')
  process.exit(1)
}

const sb = createClient(URL, ANON)

// ── Step 1: Does get_email_by_username resolve? ───────────────────────
console.log(`\n[1] get_email_by_username('${TEST_USER}')`)
const { data: resolvedEmail, error: rpcErr } = await sb.rpc('get_email_by_username', { p_username: TEST_USER })
if (rpcErr) {
  console.error(`  ✗ RPC error: ${rpcErr.message}`)
  console.error('     → The function may not exist in the remote project. Run: npx supabase db push')
  process.exit(1)
}
if (!resolvedEmail) {
  console.error(`  ✗ No email returned — '${TEST_USER}' has no row in public.Users`)
  console.error('     → Either the account was created without going through the app signup flow,')
  console.error('       or the public.Users row was deleted by an earlier migration.')
  process.exit(1)
}
console.log(`  ✓ Resolved to: ${resolvedEmail}`)

// ── Step 2: Does signInWithPassword succeed? ──────────────────────────
console.log('\n[2] signInWithPassword')
const { data: authData, error: authErr } = await sb.auth.signInWithPassword({
  email: resolvedEmail,
  password: TEST_PASS,
})
if (authErr) {
  console.error(`  ✗ Auth failed: ${authErr.message}`)
  console.error('     → Supabase Auth rejected the password. Verify credentials in Supabase Dashboard → Authentication → Users.')
  process.exit(1)
}
const jwt = authData.session?.access_token
console.log(`  ✓ Signed in. User ID: ${authData.user.id}`)

// ── Step 2b: What does auth.uid() return inside the DB with this JWT? ──
console.log('\n[2b] auth.uid() as seen by the database')
const { data: dbUid, error: dbUidErr } = await sb.rpc('debug_auth_uid')
if (dbUidErr) {
  console.error(`  ✗ RPC error: ${dbUidErr.message} (push migration 20260620000024 first)`)
} else {
  const match = dbUid === authData.user.id
  console.log(`  ${match ? '✓' : '✗'}  DB sees auth.uid() = ${dbUid}`)
  if (!match) console.error(`     → Mismatch! App user ID is ${authData.user.id}. RLS will never pass.`)
}

// ── Step 2c: Can the authenticated role see ANY rows in Users? ────────
console.log('\n[2c] Bare SELECT on public.Users (no WHERE — shows all RLS-visible rows)')
const { data: allRows, error: allRowsErr } = await sb.from('Users').select('id, username')
if (allRowsErr) {
  console.error(`  ✗ Error: ${allRowsErr.message}`)
} else {
  console.log(`  ${allRows.length > 0 ? '✓' : '✗'}  Visible rows: ${allRows.length}`)
  allRows.forEach(r => console.log(`     id=${r.id}  username=${r.username}`))
}

// ── Step 3: Can we read the public.Users row via Supabase JS? ─────────
console.log('\n[3] Query public.Users via Supabase JS client')
const { data: usersJs, error: usersJsErr } = await sb
  .from('Users')
  .select('id, username, email')
  .eq('id', authData.user.id)
  .single()
if (usersJsErr) {
  console.error(`  ✗ Failed: ${usersJsErr.message}`)
  console.error('     → The public.Users row may be missing for this auth.users entry.')
} else {
  console.log(`  ✓ Row found: username=${usersJs.username}, email=${usersJs.email}`)
}

// ── Step 4: Can we read the public.Users row via Axios (app transport)?
console.log('\n[4] Query public.Users via Axios (mirrors app transport layer)')
try {
  const res = await axios.get(`${URL}/rest/v1/Users`, {
    params: { id: `eq.${authData.user.id}` },
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${jwt}`,
    },
  })
  if (res.data?.length) {
    console.log(`  ✓ Row found via Axios: ${JSON.stringify(res.data[0])}`)
  } else {
    console.error(`  ✗ Axios returned empty array — RLS blocked the row or it does not exist`)
  }
} catch (e) {
  console.error(`  ✗ Axios error: ${e.message}`)
}

// ── Step 5: Can we read Parent_Profile (post-login child load)? ────────
console.log('\n[5] Query Parent_Profile via Axios')
try {
  const res = await axios.get(`${URL}/rest/v1/Parent_Profile`, {
    params: { user_id: `eq.${authData.user.id}` },
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${jwt}`,
    },
  })
  console.log(`  ${res.data?.length ? '✓' : '✗'} Parent_Profile rows: ${res.data?.length ?? 0}`)
} catch (e) {
  console.error(`  ✗ Error: ${e.message}`)
}

// ── Step 6: Device INSERT + SELECT round-trip ────────────────────────
console.log('\n[6] Device INSERT + SELECT round-trip')
const { data: ppRows } = await axios.get(`${URL}/rest/v1/Parent_Profile`, {
  params: { user_id: `eq.${authData.user.id}`, select: 'child_id' },
  headers: { apikey: ANON, Authorization: `Bearer ${jwt}` },
})
const linkId = ppRows?.[0]?.child_id
const { data: cpRows } = linkId ? await axios.get(`${URL}/rest/v1/Children_Profile`, {
  params: { child_id: `eq.${linkId}`, select: 'id,child_name' },
  headers: { apikey: ANON, Authorization: `Bearer ${jwt}` },
}) : { data: [] }
const cp = cpRows?.[0]
console.log(`  Parent_Profile.child_id: ${linkId ?? 'not found'}`)
console.log(`  Children_Profile.id: ${cp?.id ?? 'not found'} (${cp?.child_name ?? ''})`)
if (cp?.id) {
  const testDevice = `DiagDevice-${authData.user.id.slice(0,8)}`
  const { data: inserted } = await axios.post(`${URL}/rest/v1/Connected_Devices`,
    { child_id: cp.id, Device_name: testDevice, Add_Device: new Date().toISOString() },
    { headers: { apikey: ANON, Authorization: `Bearer ${jwt}`, Prefer: 'return=representation' } }
  )
  const insertedRow = Array.isArray(inserted) ? inserted[0] : inserted
  console.log(`  INSERT result: ${JSON.stringify(insertedRow)}`)
  const { data: fetched } = await axios.get(`${URL}/rest/v1/Connected_Devices`, {
    params: { child_id: `eq.${cp.id}` },
    headers: { apikey: ANON, Authorization: `Bearer ${jwt}` },
  })
  console.log(`  SELECT after INSERT: ${fetched?.length ?? 0} rows — ${JSON.stringify(fetched)}`)
  if (insertedRow?.Device_id) {
    await axios.delete(`${URL}/rest/v1/Connected_Devices?Device_id=eq.${insertedRow.Device_id}`,
      { headers: { apikey: ANON, Authorization: `Bearer ${jwt}` } })
    console.log('  Cleaned up test device.')
  }
}

console.log('\n─────────────────────────────────────────────\n')
