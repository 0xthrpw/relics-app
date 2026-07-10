# Relics brand asset pipeline

Everything branded in `public/` (and `src/app/favicon.ico`) is generated from
these three scripts. Nothing here runs at build time — re-run manually when the
mark, wordmark, or palette changes.

## One-time setup

```bash
cd scripts/brand
npm init -y
npm i text-to-svg puppeteer-core
# Cinzel (OFL) — wordmark/tagline glyphs get baked into the SVGs as paths
curl -so cinzel-400.ttf 'https://fonts.gstatic.com/s/cinzel/v26/8vIU7ww63mVu7gtR-kwKxNvkNOjw-gjgTYo.ttf'
curl -so cinzel-700.ttf 'https://fonts.gstatic.com/s/cinzel/v26/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnTYo.ttf'
```

`render-assets.mjs` and `make-previews.mjs` drive headless Chrome via
`puppeteer-core` and expect it at `/usr/bin/google-chrome` — adjust
`executablePath` (and the hardcoded repo path in `render-assets.mjs`) to taste.

## Scripts

1. `node make-logo.mjs` — draws the amphora mark and generates
   `logo.svg`, `logo-w-text.svg`, `your-ens-market-logo.svg` into `./out/`.
   Copy those into `public/`. The palette lives at the top of this script.
   Keep the SVGs pure ASCII: satori (the `/api/og/*` renderer) fails to parse
   SVG files containing non-ASCII characters (e.g. an em dash in aria-label).
2. `node render-assets.mjs` — renders the SVGs into every raster asset:
   `logo.png`, `logo-w-text.png`, `your-ens-market-logo.png`, `email-logo.png`,
   `apple-touch-icon.png`, `android-chrome-192x192.png`, `pwa-icon-*.png`,
   plus `fav/fav-{16,24,32,48,64}.png` favicon layers. Then:
   `convert fav/fav-16.png fav/fav-24.png fav/fav-32.png fav/fav-48.png fav/fav-64.png ../../src/app/favicon.ico`
3. `node make-previews.mjs` — renders the branded OG cards in
   `public/previews/*.jpeg` (1600x822), then downscale to the 800x411 declared
   in `manifest.json`, e.g. with PIL/ImageMagick.

## Gotchas

- The OG routes hardcode logo `width`/`height` — if the lockup aspect ratio
  changes (currently 214x64 and 181x48), update the `<img>` dims in
  `src/app/api/og/*/route.tsx` or satori will stretch the logo.
