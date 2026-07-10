// Renders the generated Relics SVGs into every raster asset the app ships.
import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'out')
const REPO = '/home/throw/work/nomentum/relics-app'
const PUB = path.join(REPO, 'public')
const BG = '#101617'

const logoSvg = fs.readFileSync(path.join(OUT, 'logo.svg'), 'utf8')
const logoWTextSvg = fs.readFileSync(path.join(OUT, 'logo-w-text.svg'), 'utf8')
const lockupSvg = fs.readFileSync(path.join(OUT, 'your-ens-market-logo.svg'), 'utf8')

const b64 = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()

// job: {svg, w, h, out, bg (null=transparent), scale (fraction of min dim the art occupies)}
async function render({ svg, w, h, out, bg = null, scale = 1 }) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  const size = Math.round(Math.min(w, h) * scale)
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:${bg ?? 'transparent'};}
    body{display:flex;align-items:center;justify-content:center;}
    img{max-width:${Math.round(w * scale)}px;max-height:${size}px;}
  </style></head><body><img src="${b64(svg)}"></body></html>`)
  await new Promise((r) => setTimeout(r, 150))
  await page.screenshot({ path: out, omitBackground: bg === null })
  console.log('rendered', path.relative(REPO, out), `${w}x${h}`)
}

// big transparent renders
await render({ svg: logoSvg, w: 1024, h: 1024, out: `${PUB}/logo.png` })
await render({ svg: logoWTextSvg, w: 1448, h: 384, out: `${PUB}/logo-w-text.png`, scale: 0.96 })
await render({ svg: lockupSvg, w: 1448, h: 512, out: `${PUB}/your-ens-market-logo.png`, scale: 0.96 })
await render({ svg: logoWTextSvg, w: 480, h: 136, out: `${PUB}/email-logo.png`, scale: 0.92 })

// icons on solid bg
await render({ svg: logoSvg, w: 180, h: 180, out: `${PUB}/apple-touch-icon.png`, bg: BG, scale: 0.82 })
await render({ svg: logoSvg, w: 192, h: 192, out: `${PUB}/android-chrome-192x192.png`, bg: BG, scale: 0.82 })
await render({ svg: logoSvg, w: 192, h: 192, out: `${PUB}/pwa-icon-192.png`, bg: BG, scale: 0.82 })
await render({ svg: logoSvg, w: 512, h: 512, out: `${PUB}/pwa-icon-512.png`, bg: BG, scale: 0.82 })
await render({ svg: logoSvg, w: 512, h: 512, out: `${PUB}/pwa-icon-maskable-512.png`, bg: BG, scale: 0.58 })

// favicon layers (transparent)
const FAV = path.join(__dirname, 'fav')
fs.mkdirSync(FAV, { recursive: true })
for (const s of [16, 24, 32, 48, 64]) {
  await render({ svg: logoSvg, w: s, h: s, out: `${FAV}/fav-${s}.png` })
}

await browser.close()
console.log('done')
