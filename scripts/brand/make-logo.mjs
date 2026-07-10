// Relics identity generator — "patina" scheme (verdigris body, moon-silver gem).
// Emits logo.svg / logo-w-text.svg / your-ens-market-logo.svg into ./out/
import TextToSVG from 'text-to-svg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cinzel = TextToSVG.loadSync(path.join(__dirname, 'cinzel-700.ttf'))
const cinzel400 = TextToSVG.loadSync(path.join(__dirname, 'cinzel-400.ttf'))

const SCHEMES = {
  patina: {
    // verdigris body, moon-silver gem
    BODY_LIGHT: '#9fe8cd',
    BODY: '#4fc3a1',
    BODY_DEEP: '#2c7f68',
    GEM: '#e9f4ee',
    GEM_DEEP: '#b9cfc7',
    FACET: '#1d5a4a',
    INK: '#f0f6f2',
    TAG: '#5fcfae',
  },
}

const bodyPath = `
    M22.5 5
    L41.5 5
    Q43 5 43 6.5
    L43 8.5
    Q43 10 41.5 10
    L37.8 10
    C37.8 13 38.4 15.4 41 17.2
    C47 21.2 50 25.5 50 30.5
    C50 39.5 43 45 38 46.8
    L37.6 50
    L40.5 51.5
    Q42.5 52.5 42.5 54.5
    L42.5 55.5
    Q42.5 57.5 40.5 57.5
    L23.5 57.5
    Q21.5 57.5 21.5 55.5
    L21.5 54.5
    Q21.5 52.5 23.5 51.5
    L26.4 50
    L26 46.8
    C21 45 14 39.5 14 30.5
    C14 25.5 17 21.2 23 17.2
    C25.6 15.4 26.2 13 26.2 10
    L22.5 10
    Q21 10 21 8.5
    L21 6.5
    Q21 5 22.5 5
    Z
    M32 21.5 L40.5 30.5 L32 39.5 L23.5 30.5 Z`

function markGroup(C) {
  return `
    <path d="M22 11.5 C11.5 13.5 10 24.5 17.5 28.5" fill="none" stroke="url(#au)" stroke-width="2.9" stroke-linecap="round"/>
    <path d="M42 11.5 C52.5 13.5 54 24.5 46.5 28.5" fill="none" stroke="url(#au)" stroke-width="2.9" stroke-linecap="round"/>
    <path d="${bodyPath.trim()}" fill="url(#au)" fill-rule="evenodd"/>
    <path d="M32 23.5 L38.5 30.5 L32 37.5 L25.5 30.5 Z" fill="url(#gem)"/>
    <path d="M32 26.5 L35.7 30.5 L32 34.5 L28.3 30.5 Z" fill="none" stroke="${C.FACET}" stroke-width="0.8" opacity="0.9"/>
    <path d="M32 23.5 L32 26.5 M38.5 30.5 L35.7 30.5 M32 37.5 L32 34.5 M25.5 30.5 L28.3 30.5" stroke="${C.FACET}" stroke-width="0.8" opacity="0.9"/>`
}

function defs(C) {
  return `
  <defs>
    <linearGradient id="au" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.BODY_LIGHT}"/>
      <stop offset="0.55" stop-color="${C.BODY}"/>
      <stop offset="1" stop-color="${C.BODY_DEEP}"/>
    </linearGradient>
    <linearGradient id="gem" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.GEM}"/>
      <stop offset="1" stop-color="${C.GEM_DEEP}"/>
    </linearGradient>
  </defs>`
}

const wordmarkD = cinzel.getD('RELICS', { x: 0, y: 0, fontSize: 34, anchor: 'left baseline', letterSpacing: 0.06 })
const wmWidth = Math.ceil(cinzel.getMetrics('RELICS', { fontSize: 34, letterSpacing: 0.06 }).width)
const tagD = cinzel400.getD('YOUR ENS MARKET', {
  x: 0,
  y: 0,
  fontSize: 12.5,
  anchor: 'left baseline',
  letterSpacing: 0.18,
})
const tagW = Math.ceil(cinzel400.getMetrics('YOUR ENS MARKET', { fontSize: 12.5, letterSpacing: 0.18 }).width)
const lockupW = Math.max(56 + wmWidth, 57 + tagW)

for (const [key, C] of Object.entries(SCHEMES)) {
  const OUT = path.join(__dirname, 'out')
  fs.mkdirSync(OUT, { recursive: true })

  const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Relics">
${defs(C)}
${markGroup(C)}
</svg>`
  fs.writeFileSync(path.join(OUT, 'logo.svg'), logo)

  const logoWText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${56 + wmWidth} 48" width="${56 + wmWidth}" height="48" role="img" aria-label="Relics">
${defs(C)}
<g transform="translate(0 -6) scale(0.82)">
${markGroup(C)}
</g>
<g transform="translate(52 36)">
  <path d="${wordmarkD}" fill="${C.INK}"/>
</g>
</svg>`
  fs.writeFileSync(path.join(OUT, 'logo-w-text.svg'), logoWText)

  const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupW} 64" width="${lockupW}" height="64" role="img" aria-label="Relics - Your ENS Market">
${defs(C)}
<g transform="translate(0 1) scale(0.97)">
${markGroup(C)}
</g>
<g transform="translate(56 34)">
  <path d="${wordmarkD}" fill="${C.INK}"/>
</g>
<g transform="translate(57 52)">
  <path d="${tagD}" fill="${C.TAG}"/>
</g>
</svg>`
  fs.writeFileSync(path.join(OUT, 'your-ens-market-logo.svg'), lockup)
  console.log('scheme', key, 'written; lockup', lockupW, 'x 64')
}
