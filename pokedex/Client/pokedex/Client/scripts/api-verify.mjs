/**
 * Verifies all newly-wired Supabase features by calling the REST API directly.
 * No browser needed.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(dir, '../.env'), 'utf8')
const get = key => env.match(new RegExp(`${key}=(.+)`))?.[1]?.trim()

const URL  = get('VITE_SUPABASE_URL')
const ANON = get('VITE_SUPABASE_ANON_KEY')

const sb = createClient(URL, ANON)

let passed = 0, failed = 0
function log(label, ok, detail = '') {
  if (ok) { console.log(`  ✓  ${label}`); passed++ }
  else     { console.error(`  ✗  ${label}${detail ? ' — ' + detail : ''}`); failed++ }
}

// ── Authenticate (required — RLS blocks all queries without a session) ─
const TEST_USER = process.env.TEST_USER || ''
const TEST_PASS = process.env.TEST_PASS || ''
if (!TEST_USER || !TEST_PASS) {
  console.error('Set TEST_USER and TEST_PASS environment variables before running.')
  console.error('  TEST_USER=myusername TEST_PASS=mypassword node scripts/api-verify.mjs')
  process.exit(1)
}

// Resolve username → email via RPC (mirrors AppContext login flow)
const { data: emailRow } = await sb.rpc('get_email_by_username', { p_username: TEST_USER })
const email = emailRow || TEST_USER
const { error: authErr } = await sb.auth.signInWithPassword({ email, password: TEST_PASS })
if (authErr) {
  console.error(`  ✗  sign-in failed — ${authErr.message}`)
  process.exit(1)
}
console.log(`  ✓  signed in as ${email}\n`)

// ── Resolve test user's Children_Profile id ───────────────────────────
const { data: users } = await sb.from('Users').select('id').eq('username', TEST_USER).single()
const userId = users?.id
log('found test user', !!userId, userId)

const { data: pp } = await sb.from('Parent_Profile').select('child_id').eq('user_id', userId).single()
const childLinkId = pp?.child_id
log('found parent profile', !!childLinkId)

const { data: cp } = await sb.from('Children_Profile').select('id').eq('child_id', childLinkId).single()
const childId = cp?.id
log('found child profile', !!childId, childId)

// ── 1. SCHEMA: connected_devices has child_id column ─────────────────
console.log('\n[1] Connected_Devices schema')
const { data: devSchema, error: devSchemaErr } = await sb
  .from('Connected_Devices')
  .select('Device_id,Device_name,child_id')
  .eq('child_id', childId)
  .limit(1)
log('child_id column exists on Connected_Devices', !devSchemaErr, devSchemaErr?.message)

// ── 2. SCHEMA: App_Restrictions has require columns ───────────────────
console.log('\n[2] App_Restrictions schema')
const { data: arSchema, error: arSchemaErr } = await sb
  .from('App_Restrictions')
  .select('id,child_id,app_name,is_allowed,require_password,require_email')
  .eq('child_id', childId)
  .limit(1)
log('require_password / require_email columns exist', !arSchemaErr, arSchemaErr?.message)

// ── 3. DEVICE: add ────────────────────────────────────────────────────
console.log('\n[3] Device add')
const devName = `TestDevice-${Date.now()}`
const { data: addedDev, error: addErr } = await sb
  .from('Connected_Devices')
  .insert({ child_id: childId, Device_name: devName, Add_Device: new Date().toISOString() })
  .select('Device_id,Device_name')
  .single()
log('device inserted', !addErr && addedDev?.Device_name === devName, addErr?.message)
const devId = addedDev?.Device_id

// ── 4. DEVICE: fetch ──────────────────────────────────────────────────
console.log('\n[4] Device fetch')
const { data: fetchedDevs, error: fetchErr } = await sb
  .from('Connected_Devices')
  .select('Device_id,Device_name')
  .eq('child_id', childId)
const found = fetchedDevs?.some(d => d.Device_name === devName)
log('device visible in fetch', found && !fetchErr, fetchErr?.message)

// ── 5. DEVICE: remove ─────────────────────────────────────────────────
console.log('\n[5] Device remove')
const { error: delErr } = await sb
  .from('Connected_Devices')
  .delete()
  .eq('Device_id', devId)
log('device deleted', !delErr, delErr?.message)
const { data: afterDel } = await sb
  .from('Connected_Devices')
  .select('Device_id')
  .eq('Device_id', devId)
log('device gone after delete', afterDel?.length === 0)

// ── 6. APP_RESTRICTIONS: upsert is_allowed = false (Stop App) ─────────
console.log('\n[6] Stop App — upsert is_allowed=false')
const { data: stopped, error: stopErr } = await sb
  .from('App_Restrictions')
  .upsert({ child_id: childId, app_name: 'Disney+', is_allowed: false },
           { onConflict: 'child_id,app_name' })
  .select('is_allowed')
  .single()
log('upsert created/updated row', !stopErr, stopErr?.message)
log('is_allowed is false', stopped?.is_allowed === false)

// ── 7. APP_RESTRICTIONS: upsert require_password = true ───────────────
console.log('\n[7] require_password — upsert without touching is_allowed')
const { data: flagged, error: flagErr } = await sb
  .from('App_Restrictions')
  .upsert({ child_id: childId, app_name: 'Disney+', require_password: true },
           { onConflict: 'child_id,app_name' })
  .select('is_allowed,require_password,require_email')
  .single()
log('upsert succeeded', !flagErr, flagErr?.message)
// Note: supabase-js upsert merges on conflict — is_allowed should remain false
log('require_password is true', flagged?.require_password === true)
log('is_allowed preserved as false', flagged?.is_allowed === false, `got: ${flagged?.is_allowed}`)

// ── 8. APP_RESTRICTIONS: resume (is_allowed = true) ───────────────────
console.log('\n[8] Resume App — set is_allowed back to true')
const { error: resumeErr } = await sb
  .from('App_Restrictions')
  .upsert({ child_id: childId, app_name: 'Disney+', is_allowed: true },
           { onConflict: 'child_id,app_name' })
log('resume upsert succeeded', !resumeErr, resumeErr?.message)

// ── 9. CLEANUP App_Restrictions test row ─────────────────────────────
await sb.from('App_Restrictions')
  .delete()
  .eq('child_id', childId)
  .eq('app_name', 'Disney+')

// ── Summary ───────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(45)}`)
console.log(`  Results: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
