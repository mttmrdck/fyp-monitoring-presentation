// Prints the submission deck (public/submission) to a 1920×1080 PDF.
// Usage: npm run build && node scripts/export-submission.mjs
import { chromium } from 'playwright-core'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { findChromium, serve } from './browser.mjs'

const FILE = 'FYP-Submission-Deck.pdf'
const server = await serve(resolve('dist'))
const browser = await chromium.launch({ executablePath: findChromium() })
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('requestfailed', (r) => errors.push(`failed: ${r.url()}`))
  await page.goto(`${server.url}/submission/index.html?print`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 20000 })
  const n = await page.locator('.slide').count()
  if (errors.length) throw new Error(errors.join('; '))
  const out = resolve('dist/submission', FILE)
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
  await copyFile(out, resolve('public/submission', FILE))
  console.log(`${n} slides → dist/submission/${FILE} (copied to public/submission/)`)
} finally {
  await browser.close()
  server.close()
}
