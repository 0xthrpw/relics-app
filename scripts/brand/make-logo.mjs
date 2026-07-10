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
    // verdigris bronze (goblet + gem), bone (skull)
    BODY_LIGHT: '#9fe8cd',
    BODY: '#4fc3a1',
    BODY_DEEP: '#2c7f68',
    BONE_LIGHT: '#f2f7f1',
    BONE: '#dde8dd',
    BONE_DEEP: '#a9bfb4',
    FACET: '#eafff6',
    INK: '#f0f6f2',
    TAG: '#5fcfae',
  },
}

// ---------------------------------------------------------------- sprites
// Pixel-art vanitas: big bone skull front, knocked-over goblet behind it.
// Legend: . transparent / K outline / W bone light / B bone shade /
//         g verdigris light / G verdigris / D verdigris deep
const SKULL = [
  '....KKKKKKKKKK....',
  '..KKWWWWWWWWBBKK..',
  '.KWWWWWWWGWWWWBBK.',
  '.KWWWWWWGgGWWWBBK.',
  '.KWWWWWGGgGGWWBBK.',
  '.KWWWWWWGGGWWWBBK.',
  '.KWWWWWWWGWWWWBBK.',
  '.KWWWWWWWWWWWWBBK.',
  '.KWKKKKWWWWKKKKBK.',
  '.KWKKKKWWWWKKKKBK.',
  '.KWKKKKWWWWKKKKBK.',
  '.KWWWWWWWWWWWWBBK.',
  '.KWWWWWWKKWWWWBBK.',
  '.KWWWWWKKKKWWWBBK.',
  '..KWWWWWWWWWWBBK..',
  '...KWWWWWWWWWBK...',
  '....KWWWWWWWWK....',
  '....KWWKWWKWBK....',
  '....KWWKWWKWBK....',
  '....KWWKWWKWBK....',
  '....KKKKKKKKKK....',
]

const GOBLET = [
  '...KKKK.KKKKKKKKK...............',
  '..KggggKggggggggK...........KK..',
  '.KDgggKgggggggggK..........KggK.',
  '.KDggggKggggggggKKKKKKKKKKKKggK.',
  '.KDgggKgggggggggKGGGGGGGGGGKGGK.',
  '.KDGGGGKGGGGGGGGKGGGGGGGGGGKGGK.',
  '.KDGGGKGGGGGGGGGKKKKKKKKKKKKGGK.',
  '.KDDDDDKDDDDDDDDK..........KGGK.',
  '.KDDDDKDDDDDDDDDK...........KK..',
  '..KKKKKKKKKKKKKKK...............',
]

const SHARD = ['gG.', 'GGD']

function stamp(grid, sprite, ox, oy) {
  sprite.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '.') grid[oy + y][ox + x] = row[x]
    }
  })
}

const SCENE_W = 32
const SCENE_H = 24

function buildScene() {
  const grid = Array.from({ length: SCENE_H }, () => Array(SCENE_W).fill('.'))
  stamp(grid, GOBLET, 0, 12)
  stamp(grid, SKULL, 7, 3)
  stamp(grid, SHARD, 4, 22)
  return grid
}

function markGroup(C) {
  const pal = {
    K: '#16241f',
    W: C.BONE_LIGHT,
    B: C.BONE_DEEP,
    g: C.BODY_LIGHT,
    G: C.BODY,
    D: C.BODY_DEEP,
  }
  const grid = buildScene()
  const rects = []
  for (let y = 0; y < SCENE_H; y++) {
    let x = 0
    while (x < SCENE_W) {
      const c = grid[y][x]
      if (c === '.') {
        x++
        continue
      }
      let w = 1
      while (x + w < SCENE_W && grid[y][x + w] === c) w++
      rects.push(`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${pal[c]}"/>`)
      x += w
    }
  }
  return `<g shape-rendering="crispEdges">\n${rects.join('\n')}\n</g>`
}

function defs() {
  return ''
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
const lockupW = Math.max(80 + wmWidth, 81 + tagW)

for (const [key, C] of Object.entries(SCHEMES)) {
  const OUT = path.join(__dirname, 'out')
  fs.mkdirSync(OUT, { recursive: true })

  const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="128" height="96" role="img" aria-label="Relics">
${defs()}
${markGroup(C)}
</svg>`
  fs.writeFileSync(path.join(OUT, 'logo.svg'), logo)

  const logoWText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${64 + wmWidth} 48" width="${64 + wmWidth}" height="48" role="img" aria-label="Relics">
${defs()}
<g transform="translate(0.5 2) scale(1.8333)">
${markGroup(C)}
</g>
<g transform="translate(64 36)">
  <path d="${wordmarkD}" fill="${C.INK}"/>
</g>
</svg>`
  fs.writeFileSync(path.join(OUT, 'logo-w-text.svg'), logoWText)

  const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupW} 64" width="${lockupW}" height="64" role="img" aria-label="Relics - Your ENS Market">
${defs()}
<g transform="translate(0.8 4) scale(2.3333)">
${markGroup(C)}
</g>
<g transform="translate(80 34)">
  <path d="${wordmarkD}" fill="${C.INK}"/>
</g>
<g transform="translate(81 52)">
  <path d="${tagD}" fill="${C.TAG}"/>
</g>
</svg>`
  fs.writeFileSync(path.join(OUT, 'your-ens-market-logo.svg'), lockup)
  console.log('scheme', key, 'written; lockup', lockupW, 'x 64')
}
