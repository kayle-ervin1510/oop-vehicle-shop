import { firefox } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env manually (no dotenv dependency needed)
const __dir = dirname(fileURLToPath(import.meta.url))
const envText = readFileSync(resolve(__dir, '.env'), 'utf8')
const env = Object.fromEntries(
  envText.split('\n').filter(l => l.includes('=')).map(l => {
    const i = l.indexOf('=')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY
const BASE = 'http://localhost:5173'

// Unique test account so re-runs don't collide
const RUN_ID = Date.now()
const TEST_EMAIL    = `zaptest_${RUN_ID}@mailtest.dev`
const TEST_PASSWORD = 'TestPass123!'

// Stripe test card: always succeeds
const TEST_CARD = '4242424242424242'
const TEST_EXP  = '12/34'
const TEST_CVC  = '123'
const TEST_ZIP  = '12345'

;(async () => {
  // ── 0. Create a test account via Supabase (bypasses UI signup flow) ────────
  console.log('0. Creating test account via Supabase API…')
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    options: { data: { first_name: 'Test', username: `zaptest_${RUN_ID}` } },
  })
  if (signUpError) {
    console.error('   ✗ Supabase signUp failed:', signUpError.message)
    process.exit(1)
  }
  if (!signUpData.user) {
    console.error('   ✗ signUp returned no user — is "Confirm email" still enabled in Supabase?')
    process.exit(1)
  }
  console.log('   ✓ Account created:', TEST_EMAIL)

  const browser = await firefox.launch({ headless: true })
  const page = await browser.newPage()

  // ── 1. Log in ──────────────────────────────────────────────────────────────
  console.log('1. Logging in via the app…')
  await page.goto(`${BASE}/login`)
  await page.waitForLoadState('networkidle')

  await page.locator('input[name="usernameOrEmail"]').fill(TEST_EMAIL)
  await page.locator('input[type="password"]').first().fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').first().click()

  try {
    await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 })
    console.log('   ✓ Logged in — on dashboard')
  } catch {
    const url = page.url()
    const body = await page.locator('body').innerText().catch(() => '')
    console.error('   ✗ Login failed. Current URL:', url)
    console.error('   Page text (first 300 chars):', body.slice(0, 300))
    await browser.close()
    process.exit(1)
  }

  // ── 2. Navigate to /donate via the floating button (keeps SPA session) ─────
  console.log('2. Navigating to /donate…')
  // Wait for the floating donate button to appear (only visible when logged in)
  await page.waitForSelector('a[href="/donate"]', { timeout: 10000 })
  await page.locator('a[href="/donate"]').click()
  // Wait for React Router to finish navigating
  await page.waitForURL('**/donate', { timeout: 10000 })
  await page.waitForLoadState('networkidle')
  console.log('   ✓ On donate page, URL:', page.url())

  // ── 3. Select $10 preset ───────────────────────────────────────────────────
  console.log('3. Selecting $10 preset…')
  await page.locator('button:has-text("$10")').click()
  console.log('   ✓ $10 selected')

  // ── 4. Fill Stripe card iframe ─────────────────────────────────────────────
  console.log('4. Filling Stripe card details…')

  // Wait for the Stripe iframe to appear
  await page.waitForSelector('iframe[name^="__privateStripeFrame"], iframe[title*="Secure card"], iframe[src*="stripe"]', { timeout: 10000 })

  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"], iframe[title*="Secure card"], iframe[src*="stripe"]').first()

  // Card number
  const cardInput = stripeFrame.locator('input[name="cardnumber"], input[placeholder*="Card number"], input[autocomplete="cc-number"]')
  await cardInput.click()
  await cardInput.type(TEST_CARD, { delay: 30 })

  // Expiry
  const expInput = stripeFrame.locator('input[name="exp-date"], input[placeholder*="MM"], input[autocomplete="cc-exp"]')
  await expInput.click()
  await expInput.type(TEST_EXP, { delay: 30 })

  // CVC
  const cvcInput = stripeFrame.locator('input[name="cvc"], input[placeholder*="CVC"], input[autocomplete="cc-csc"]')
  await cvcInput.click()
  await cvcInput.type(TEST_CVC, { delay: 30 })

  // ZIP (may or may not be present)
  const zipInput = stripeFrame.locator('input[name="postal"], input[placeholder*="ZIP"]')
  if (await zipInput.count() > 0) {
    await zipInput.click()
    await zipInput.type(TEST_ZIP, { delay: 30 })
  }

  console.log('   ✓ Card details filled')

  // ── 5. Submit ──────────────────────────────────────────────────────────────
  console.log('5. Submitting donation…')
  await page.locator('button[type="submit"]:has-text("Donate")').click()

  // Wait for success, card error, or network error
  console.log('   Waiting for result (up to 30s)…')

  try {
    await Promise.race([
      page.waitForSelector('[data-testid="donate-success"]', { timeout: 30000 }),
      page.waitForSelector('[data-testid="donate-error"]', { timeout: 30000 }),
      page.waitForSelector('[data-testid="donate-network-error"]', { timeout: 30000 }),
    ])
  } catch {
    console.error('   ✗ Timed out waiting for a result')
    const bodyText = await page.locator('body').innerText().catch(() => '')
    console.error('   Page text:', bodyText.slice(0, 500))
    await browser.close()
    process.exit(1)
  }

  const success      = await page.locator('[data-testid="donate-success"]').count()
  const cardErr      = await page.locator('[data-testid="donate-error"]').count()
  const networkErr   = await page.locator('[data-testid="donate-network-error"]').count()

  if (success > 0) {
    const msg = await page.locator('[data-testid="donate-success"]').innerText()
    console.log('\n✅ DONATION SUCCEEDED')
    console.log('   Message:', msg.trim())
  } else if (cardErr > 0) {
    const msg = await page.locator('[data-testid="donate-error"]').innerText()
    console.log('\n❌ CARD ERROR')
    console.log('   Message:', msg.trim())
  } else if (networkErr > 0) {
    const msg = await page.locator('[data-testid="donate-network-error"]').innerText()
    console.log('\n❌ NETWORK / EDGE FUNCTION ERROR')
    console.log('   Message:', msg.trim())
  }

  await browser.close()
})()
