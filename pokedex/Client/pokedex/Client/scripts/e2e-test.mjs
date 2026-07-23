/**
 * End-to-end walkthrough: verifies all newly-wired Supabase features.
 * Run with: node scripts/e2e-test.mjs
 */
import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'

// ── Change these to a real test account in your Supabase Users table ──
const TEST_USER = process.env.TEST_USER || ''
const TEST_PASS = process.env.TEST_PASS || ''

if (!TEST_USER || !TEST_PASS) {
  console.error('Set TEST_USER and TEST_PASS environment variables before running.')
  console.error('  TEST_USER=myusername TEST_PASS=mypassword node scripts/e2e-test.mjs')
  process.exit(1)
}

let passed = 0
let failed = 0

function log(label, ok, detail = '') {
  if (ok) {
    console.log(`  ✓  ${label}`)
    passed++
  } else {
    console.error(`  ✗  ${label}${detail ? ' — ' + detail : ''}`)
    failed++
  }
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ||
    `${process.env.HOME}/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const ctx = await browser.newContext()
const page = await ctx.newPage()

// Capture console errors
const consoleErrors = []
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
page.on('pageerror', err => consoleErrors.push(err.message))

// ── 1. Login ──────────────────────────────────────────────────────────
console.log('\n[1] Login')
await page.goto(`${BASE}/login`)
await page.fill('input[type="text"], input[placeholder*="sername"], input[placeholder*="mail"]', TEST_USER)
await page.fill('input[type="password"]', TEST_PASS)
await page.click('button[type="submit"]')
await page.waitForURL(`${BASE}/dashboard`, { timeout: 8000 }).catch(() => {})
log('redirected to dashboard', page.url().includes('/dashboard'))

// ── 2. Pick a child ───────────────────────────────────────────────────
console.log('\n[2] Pick first child')
// Wait up to 8s for at least one child card to appear (data loads async after login)
const firstCardBtn = await page.waitForSelector('.child-card-actions .btn-teal', { timeout: 8000 })
  .catch(() => null)
if (!firstCardBtn) {
  console.error('  No child cards found — create one in the app first and re-run.')
  await browser.close()
  process.exit(1)
}
const childLinks = await page.$$('.child-card-actions .btn-teal')
// Navigate to first child's apps page
const firstManageBtn = await page.$$('.child-card-actions .btn-outline')
const childCard = await page.$('.child-card')
const childName = await childCard.$eval('.child-card-name', el => el.textContent)
console.log(`  Using child: ${childName}`)
await firstManageBtn[0].click()
await page.waitForURL(/\/dashboard\/.+\/apps/, { timeout: 5000 })
const childId = page.url().match(/\/dashboard\/([^/]+)\/apps/)?.[1]
log('navigated to Manage Apps', !!childId)

// ── 3. Add a device ───────────────────────────────────────────────────
console.log('\n[3] Add device (persisted to Connected_Devices)')
const deviceName = `TestDevice-${Date.now()}`
await page.click('button:has-text("+ Connect Device")')
await wait(300)
await page.fill('input[placeholder*="iPad"], input[placeholder*="evice"]', deviceName)
await page.click('button:has-text("Next")')
await wait(200)
// Choose "Install Zap App" path (no real phone needed)
await page.click('button:has-text("Install Zap App")')
await wait(200)
await page.click('button:has-text("Mark as Installed")')
await wait(1000)
const deviceRows = await page.$$('.device-row')
const deviceFound = await Promise.any(
  deviceRows.map(r => r.$eval('.device-name', el => el.textContent))
).then(names => names === deviceName).catch(() => false)
const deviceRowTexts = await Promise.all(deviceRows.map(r => r.$eval('.device-name', el => el.textContent)))
log('device appears in UI', deviceRowTexts.includes(deviceName), deviceRowTexts.join(', '))

// ── 4. Persist check: reload and device still there ───────────────────
console.log('\n[4] Reload and verify device persisted')
await page.reload()
// Wait for session restoration — ProtectedRoute redirects to /login if session is lost
await page.waitForURL(/\/dashboard\/.+\/apps/, { timeout: 10000 }).catch(() => {})
const urlAfterReload = page.url()
console.log(`  URL after reload: ${urlAfterReload}`)
let reloadedDeviceRows = []
if (!urlAfterReload.includes('/dashboard')) {
  log('still on dashboard after reload (session survived)', false, 'redirected to login — session lost on reload')
} else {
  // Wait for the device section to render
  await page.waitForSelector('.device-row', { timeout: 8000 }).catch(() => {})
  reloadedDeviceRows = await page.$$('.device-row')
  const reloadedNames = await Promise.all(reloadedDeviceRows.map(r => r.$eval('.device-name', el => el.textContent)))
  log('device persists after reload', reloadedNames.includes(deviceName), reloadedNames.join(', ') || '(no device rows found)')
}

// ── 5. Remove the device ──────────────────────────────────────────────
console.log('\n[5] Remove device')
// Array.find doesn't work with async callbacks — iterate manually
let deviceRowToDelete = null
for (const r of reloadedDeviceRows) {
  const n = await r.$eval('.device-name', el => el.textContent).catch(() => '')
  if (n === deviceName) { deviceRowToDelete = r; break }
}
if (deviceRowToDelete) {
  const xBtn = await deviceRowToDelete.$('.x-btn-device')
  if (xBtn) {
    await xBtn.click()
    await wait(1000)
  }
}
const afterDeleteRows = await page.$$('.device-row')
const afterDeleteNames = await Promise.all(afterDeleteRows.map(r => r.$eval('.device-name', el => el.textContent).catch(() => '')))
log('device removed from UI', !afterDeleteNames.includes(deviceName))

// ── 6. Navigate to Screen Time and Stop App ───────────────────────────
console.log('\n[6] Stop App (persisted via App_Restrictions.is_allowed)')
await page.goto(`${BASE}/dashboard/${childId}/overview`)
await wait(1000)
const stopBtns = await page.$$('.stop-app-btn')
if (stopBtns.length === 0) {
  log('stop app buttons present', false, 'no apps on today tab')
} else {
  const firstAppName = await page.$eval('.st-app-name', el => el.textContent)
  await stopBtns[0].click()
  await wait(1200)
  const btnText = await page.$eval('.stop-app-btn', el => el.textContent)
  log('button changes to Resume', btnText.trim() === 'Resume', btnText)

  // ── 7. Reload and verify stop persisted ──────────────────────────
  console.log('\n[7] Reload and verify Stop persists')
  await page.reload()
  await wait(1500)
  const reloadedBtnText = await page.$eval('.stop-app-btn', el => el.textContent).catch(() => '')
  log(`${firstAppName} still stopped after reload`, reloadedBtnText.trim() === 'Resume', reloadedBtnText)

  // Resume it (cleanup)
  const resumeBtn = await page.$('.stop-app-btn-resume')
  if (resumeBtn) await resumeBtn.click()
  await wait(800)
}

// ── 8. Edit Parameters: requirePassword checkbox ──────────────────────
console.log('\n[8] Edit Parameters — requirePassword persists')
await page.goto(`${BASE}/dashboard/${childId}/apps`)
await wait(800)
const editLink = await page.$('.app-row-edit')
if (!editLink) {
  log('edit params link present', false, 'no time-restricted apps found')
} else {
  await editLink.click()
  await page.waitForURL(/\/edit\//, { timeout: 4000 })
  await wait(300)

  // Check the requirePassword checkbox
  const pwCheckbox = await page.$('input[type="checkbox"]')
  const wasChecked = await pwCheckbox.isChecked()
  if (!wasChecked) await pwCheckbox.click()
  await wait(200)

  await page.click('button[type="submit"]')
  await wait(1200)

  // Navigate back to edit page and verify checkbox is still checked
  await page.goto(page.url().replace(/.*\/edit\//, `${BASE}/dashboard/${childId}/edit/`))
  // Re-navigate the same edit page
  await page.goto(`${BASE}/dashboard/${childId}/apps`)
  await wait(500)
  await page.click('.app-row-edit')
  await page.waitForURL(/\/edit\//, { timeout: 4000 })
  await wait(500)

  const pwCheckboxReloaded = await page.$('input[type="checkbox"]')
  const isCheckedAfterReload = await pwCheckboxReloaded.isChecked()
  log('requirePassword persists after navigate-back', isCheckedAfterReload)

  // Uncheck it (cleanup)
  if (isCheckedAfterReload) await pwCheckboxReloaded.click()
  await page.click('button[type="submit"]')
  await wait(800)
}

// ── Summary ───────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(45)}`)
console.log(`  Results: ${passed} passed, ${failed} failed`)
if (consoleErrors.length > 0) {
  console.log(`\n  Console errors detected:`)
  consoleErrors.slice(0, 5).forEach(e => console.log(`    ${e}`))
}
console.log()

await browser.close()
process.exit(failed > 0 ? 1 : 0)
