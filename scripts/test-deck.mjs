// End-to-end checks for the 8-slide website and its PDF. Usage: npm run build:all && npm test
import { chromium } from 'playwright-core'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PDFDocument, PDFName, PDFArray, PDFDict } from 'pdf-lib'
import { findChromium, serve } from './browser.mjs'

let failed = 0
const ok = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${!cond && detail ? `  — ${detail}` : ''}`)
  if (!cond) failed++
}

const server = await serve(resolve('dist'))
const browser = await chromium.launch({ executablePath: findChromium() })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const hash = () => page.evaluate(() => location.hash)
  const key = async (k, n = 1) => {
    for (let i = 0; i < n; i++) await page.keyboard.press(k)
    await page.waitForTimeout(120)
  }
  const go = async (n) => {
    await page.goto(`${server.url}/#/${n}`)
    await page.waitForSelector('.slide[data-state="active"]')
    await page.waitForTimeout(250)
  }
  const active = (sel, opts) => page.locator(`.slide[data-state="active"] ${sel}`, opts)

  /* Structure */
  await go(1)
  ok('deck has 8 slides (no more)', (await page.locator('.slide').count()) === 8)
  const crit = await page.evaluate(() => [...document.querySelectorAll('.slide-foot-c')].map((e) => e.textContent).join(' | '))
  for (const c of ['Project title', 'Introduction', 'Objectives', 'Problem statement', 'Literature review', 'Stakeholder collaboration']) {
    ok(`criterion covered: ${c}`, crit.includes(c))
  }

  /* Navigation */
  await key('ArrowRight')
  ok('→ advances to slide 2', (await hash()) === '#/2')
  await key('End')
  ok('End → slide 8', (await hash()) === '#/8')
  await key('Home')
  ok('Home → slide 1', (await hash()) === '#/1')
  await key('o')
  ok('O opens slides & sources', (await page.locator('.overview[role=dialog]').count()) === 1)
  ok('sources panel lists references', (await page.locator('.overview .refs li').count()) >= 10)
  await key('Escape')
  ok('Esc closes it', (await page.locator('.overview').count()) === 0)

  /* B · Terraform line interaction */
  await go(2)
  ok('slide 2 shows the exact scanned file (declares the IAM role)', (await active('.code').innerText()).includes('resource "aws_iam_role" "app"'))
  ok('slide 2 starts on the SSH line', (await active('.callout.is-open .callout-t').innerText()).includes('SSH'))
  await active('.code-flag').nth(1).click()
  await page.waitForTimeout(350)
  ok('clicking the IAM line explains it', (await active('.callout.is-open .callout-t').innerText()).includes('S3'))
  await key('ArrowRight')
  await page.waitForTimeout(250)
  ok('Next steps to the S3 line', (await active('.callout.is-open .callout-t').innerText()).includes('public access'))
  await key('ArrowRight')
  ok('then moves to slide 3', (await hash()) === '#/3')

  /* Problem: isolated → connected → PS reveals */
  ok('slide 3 starts isolated', (await active('.s3-stage.is-connected').count()) === 0)
  await key('ArrowRight')
  ok('Next connects the findings', (await active('.s3-stage.is-connected').count()) === 1)
  await key('ArrowRight', 3)
  ok('then reveals PS1–PS3 in turn (PS3 open)', (await active('.ps-item.is-open .ps-id').innerText()) === 'PS3')
  await active('.ps-head').first().click()
  await page.waitForTimeout(300)
  ok('clicking DETECT opens PS1', (await active('.ps-item.is-open .ps-id').innerText()) === 'PS1')

  /* D · Objectives highlight the analyzer */
  await go(4)
  const litFor = async () => (await active('.pipe-stage.is-lit .pipe-t').allInnerTexts()).join(',')
  ok('O1 lights Terraform + Rule checks', (await litFor()) === 'Terraform,Rule checks')
  await active('.objs .obj-head').nth(1).click()
  await page.waitForTimeout(150)
  ok('O2 lights the relationship graph', (await litFor()) === 'Relationship graph')
  await active('.obj-head--eval').click()
  await page.waitForTimeout(150)
  ok('O4 lights evaluation', (await active('.pipe-eval.is-lit').count()) === 1)

  /* A · E · Literature: real sources */
  await go(5)
  ok('literature opens on a real paper page', (await active('.bw-view img').getAttribute('src')).includes('paper-movva'))
  await active('.rail-i', { hasText: 'Checkov' }).click()
  await page.waitForTimeout(450)
  ok('selecting Checkov shows its real site', (await active('.bw-view img').getAttribute('src')).includes('checkov.webp'))
  await active('.seg button', { hasText: 'GitHub' }).click()
  await page.waitForTimeout(450)
  ok('GitHub toggle shows the real repository', (await active('.bw-view img').getAttribute('src')).includes('checkov-gh'))
  ok('browser URL bar opens the real source', (await active('.bw-url').getAttribute('href')) === 'https://github.com/bridgecrewio/checkov')
  await active('.rail-i', { hasText: 'AWS Security Hub' }).click()
  await page.waitForTimeout(450)
  ok('AWS Security Hub shows the real product page screenshot', (await active('.bw-view img').getAttribute('src')).includes('securityhub.webp') && (await active('.bw-cap').innerText()).includes('presenter'))
  const imgs = await page.evaluate(() => [...document.querySelectorAll('img')].map((i) => [i.getAttribute('src'), i.complete && i.naturalWidth > 0]))
  ok('every source image loads', imgs.every(([, okk]) => okk), JSON.stringify(imgs.filter(([, o]) => !o)))

  /* C · Attack path */
  await go(6)
  ok('slide 6 shows real Checkov summary', (await active('.term-sum').innerText()).includes('Failed checks: 17'))
  await active('.chain-n').nth(3).click()
  await page.waitForTimeout(200)
  ok('selecting IAM role highlights its Checkov lines', (await active('.term-f.is-hit').count()) === 2)
  ok('and shows the evidence for its link', (await active('.chain-e.is-on .chain-ev').innerText()).includes('s3:*'))
  await active('.btn--red').click()
  await page.waitForTimeout(450)
  ok('Highlight full path lights every node', (await active('.chain-i.is-full').count()) === 5)
  ok('and shows the planned report', (await active('.rep-t').innerText()).includes('Internet → S3'))
  ok('report is labelled as a mock-up', (await active('.tag--amber').innerText()).includes('mock-up'))

  /* Stakeholders honesty */
  await go(7)
  ok('stakeholders: Lejiend Community leads as collaborator', (await active('.collab-name').innerText()).includes('Lejiend Community') && (await active('.collab-status').innerText()).toLowerCase().includes('confirmed'))
  ok('stakeholders: Farhan Helmy marked contacted', (await active('.other--contacted').innerText()).includes('Farhan Helmy'))
  ok('stakeholders: Lejiend owner LinkedIn linked', (await active('.collab-links a[href="https://www.linkedin.com/in/lejiend/"]').count()) === 1)

  /* Links + PDF button */
  const ext = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].map((a) => [a.target, a.rel]))
  ok(`external links open in a new tab (${ext.length})`, ext.length >= 18 && ext.every(([t, r]) => t === '_blank' && r.includes('noopener')))
  const pdfHref = await page.locator('.bar a[download]').getAttribute('href')
  const res = await page.request.get(`${server.url}${pdfHref}`)
  ok('PDF button serves the PDF', res.ok() && (res.headers()['content-type'] ?? '').includes('pdf'))

  /* Mobile */
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } })
  for (const n of [2, 3, 5, 6]) {
    await phone.goto(`${server.url}/#/${n}`)
    await phone.waitForTimeout(250)
    ok(`phone slide ${n}: flow layout, no sideways scroll`, (await phone.locator('.deck--flow').count()) === 1 && (await phone.evaluate(() => document.querySelector('.stage').scrollWidth <= innerWidth)))
  }
  ok('no console or page errors', errors.length === 0, errors.join('; '))

  /* PDF completeness */
  const print = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await print.goto(`${server.url}/?pdf`, { waitUntil: 'networkidle' })
  await print.waitForFunction(() => window.__deckReady === true)
  ok('print view renders 8 slides', (await print.locator('.print-page').count()) === 8)
  ok('print view: no interactive controls', (await print.locator('.print-page .seg, .print-page .btn, .print-page .code-flag, .print-page .rep-wait').count()) === 0)
  const text = (await print.locator('.print-deck').innerText()).toLowerCase()
  for (const needle of [
    'limited contextual analysis of interconnected iac configurations',
    'limited explainability of interconnected security findings',
    'limited contextual prioritisation of combined cloud security risks',
    'to identify and analyse selected aws cloud misconfigurations',
    'to develop context-aware analysis',
    'to develop an explainable risk assessment approach',
    'to evaluate the proposed analyzer',
    '≥3 clean, 2 tricky-but-safe, ≥2 attack-path chains',
    'ssh open to the whole internet',
    'role can do anything in s3',
    'bucket has no public access block',
    'failed checks: 17',
    'vpc_security_group_ids = [aws_security_group.web.id]',
    'not a confirmed exploit',
    'planned mock-up',
    'https://doi.org/10.34218/ijcst_02_01_002',
    'https://doi.org/10.33564/ijeast.2026.v11i05.010',
    'https://doi.org/10.3390/computers15070409',
    'cis amazon web services foundations benchmark v7.0.0',
    'muhammad akif zafran bin mohd zulkifly',
    '23001990',
    'bachelor of computer science (information systems)',
    'dr. fairuz amalina narudin',
    'lejiend community',
    'farhan helmy',
    'iam_instance_profile → aws_iam_instance_profile.app',
  ]) {
    ok(`PDF shows "${needle.slice(0, 50)}"`, text.includes(needle))
  }
  for (const name of ['Checkov', 'Trivy', 'Prowler', 'AWS Security Hub']) ok(`PDF shows tool: ${name}`, text.includes(name.toLowerCase()))
  const overflow = await print.evaluate(() =>
    [...document.querySelectorAll('.print-page')]
      .map((pg, i) => {
        const box = pg.getBoundingClientRect()
        const foot = pg.querySelector('.slide-foot').getBoundingClientRect()
        const bad = [...pg.querySelectorAll('.slide-inner *')].filter((e) => {
          const r = e.getBoundingClientRect()
          return r.width && r.height && (r.bottom > foot.top - 4 || r.right > box.right + 1)
        })
        return bad.length ? `slide ${i + 1}: ${String(bad[0].className).slice(0, 40)}` : null
      })
      .filter(Boolean),
  )
  ok('print view: nothing overflows a slide or its footer', overflow.length === 0, overflow.join(', '))

  const pdfPath = resolve('dist/FYP-Monitoring-Presentation.pdf')
  const pdf = await PDFDocument.load(await readFile(pdfPath))
  ok('PDF has 8 pages', pdf.getPageCount() === 8)
  ok('PDF pages are 16:9 (1920×1080 px)', pdf.getPages().every((p) => Math.round(p.getWidth()) === 1440 && Math.round(p.getHeight()) === 810))
  let uris = 0
  for (const p of pdf.getPages()) {
    const annots = p.node.lookupMaybe(PDFName.of('Annots'), PDFArray)
    for (let i = 0; i < (annots?.size() ?? 0); i++) if (annots.lookup(i, PDFDict).lookupMaybe(PDFName.of('A'), PDFDict)?.get(PDFName.of('URI'))) uris++
  }
  ok(`PDF has clickable links (${uris})`, uris >= 25)
  ok('PDF size is reasonable', (await stat(pdfPath)).size < 15_000_000)
} finally {
  await browser.close()
  server.close()
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
