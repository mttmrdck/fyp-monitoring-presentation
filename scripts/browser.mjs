// Shared helpers for the export and test scripts: a tiny static server for dist/ and a Chromium finder.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { homedir } from 'node:os'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
}

export async function serve(root) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    let p = normalize(join(root, decodeURIComponent(url.pathname)))
    if (!p.startsWith(root)) return res.writeHead(403).end()
    try {
      if ((await stat(p)).isDirectory()) p = join(p, 'index.html')
    } catch {
      p = join(root, 'index.html')
    }
    try {
      const body = await readFile(p)
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }).end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }
}

/** CHROME_PATH, then Playwright's cached Chromium, then installed Chrome/Edge/Brave. */
export function findChromium() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  const cache = join(homedir(), 'Library/Caches/ms-playwright')
  const linuxCache = join(homedir(), '.cache/ms-playwright')
  for (const base of [cache, linuxCache]) {
    if (!existsSync(base)) continue
    for (const d of readdirSync(base).filter((x) => x.startsWith('chromium-')).sort().reverse()) {
      for (const rel of [
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-linux/chrome',
      ]) {
        const p = join(base, d, rel)
        if (existsSync(p)) return p
      }
    }
  }
  for (const p of [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ]) {
    if (existsSync(p)) return p
  }
  throw new Error('No Chromium found. Set CHROME_PATH or run: npx playwright install chromium')
}
