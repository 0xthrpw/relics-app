// Branded OG preview cards (800x411 to match manifest.json) for relics-app.
import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUB = '/home/throw/work/nomentum/relics-app/public'
const lockup = fs.readFileSync(path.join(__dirname, 'out', 'your-ens-market-logo.svg'), 'utf8')
const b64 = 'data:image/svg+xml;base64,' + Buffer.from(lockup).toString('base64')

const CARDS = [
  { file: 'home.jpeg', label: '' },
  { file: 'marketplace.jpeg', label: 'Marketplace' },
  { file: 'explore.jpeg', label: 'Explore' },
  { file: 'categories.jpeg', label: 'Categories' },
  { file: 'portfolio.jpeg', label: 'Portfolio' },
]

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 800, height: 411, deviceScaleFactor: 2 })

for (const { file, label } of CARDS) {
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;width:800px;height:411px;background:#191512;overflow:hidden}
    .glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%, #d9b36a24 0%, transparent 70%)}
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px}
    img{height:150px}
    .label{color:#a89a88;font:600 26px/1 Georgia, 'Times New Roman', serif;letter-spacing:0.35em;text-transform:uppercase;margin-left:0.35em}
    .rule{width:64px;height:2px;background:#d9b36a;border-radius:1px}
  </style></head><body>
    <div class="glow"></div>
    <div class="wrap">
      <img src="${b64}">
      ${label ? `<div class="rule"></div><div class="label">${label}</div>` : ''}
    </div>
  </body></html>`)
  await new Promise((r) => setTimeout(r, 120))
  await page.screenshot({ path: `${PUB}/previews/${file}`, type: 'jpeg', quality: 92 })
  console.log('OK', file)
}
await browser.close()
