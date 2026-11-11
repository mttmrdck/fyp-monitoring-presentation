// Generates the 16-page 1920×1080 PDF from the built site's static print view (?pdf).
// Usage: npm run build && npm run pdf
import { chromium } from 'playwright-core'
import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { findChromium, serve } from './browser.mjs'

const root = resolve('dist')
const FILE = 'FYP-Monitoring-Presentation.pdf'
if (!existsSync(resolve(root, 'index.html'))) {
  console.error('dist/ missing — run `npm run build` first.')
  process.exit(1)
}

const server = await serve(root)
const browser = await chromium.launch({ executablePath: findChromium() })
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`${server.url}/?pdf`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__deckReady === true, null, { timeout: 20000 })
  const pages = await page.locator('.print-page').count()
  if (pages !== 8) throw new Error(`Expected 8 slides, found ${pages}`)
  if (errors.length) throw new Error(`Page errors: ${errors.join('; ')}`)
  const out = resolve(root, FILE)
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
  await mkdir('public', { recursive: true })
  await copyFile(out, resolve('public', FILE))
  console.log(`PDF written: dist/${FILE} (copied to public/${FILE})`)
} finally {
  await browser.close()
  server.close()
}
