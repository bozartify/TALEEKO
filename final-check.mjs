import { chromium } from './node_modules/playwright/index.mjs'

const PAGES = [
  '/notifications', '/settings', '/reports', '/analytics',
  '/differentiation', '/standards-unpacker', '/unit-planner',
  '/rubrics', '/curriculum', '/scope-sequence',
]

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true })
  const page = await browser.newPage()

  await page.goto('http://localhost:6581/login')
  await page.fill('input[type="email"]', 'demo@taleeko.ai')
  await page.fill('input[type="password"]', 'demo123')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 12000 })

  let passed = 0, failed = 0

  for (const path of PAGES) {
    try {
      await page.goto(`http://localhost:6581${path}`, { timeout: 12000, waitUntil: 'domcontentloaded' })
      const content = await page.content()
      const ok = !content.includes('Dashboard Error') && !content.includes('Application error') && content.length > 500
      console.log(ok ? 'PASS' : 'FAIL', path)
      if (ok) passed++; else failed++
    } catch (e) {
      failed++
      console.log('FAIL', path, e.message.slice(0, 50))
    }
  }

  await browser.close()
  console.log(`\n${passed}/${PAGES.length} passed`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch(e => { console.error(e.message); process.exit(1) })
