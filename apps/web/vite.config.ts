import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deliberately no <link rel="preload"> for fonts. It was implemented and
// measured: preloading the two Latin subsets raised LCP from 980ms to 1296ms
// (en) and 964ms to 1312ms (es) under 1.6 Mbps / 150ms RTT / 4x CPU. Raising
// the fonts to high priority makes them compete with the 290 kB bundle, and
// the bundle is what gates first paint here — React must run before the h1
// exists. Fetching fonts sooner is not worth delaying the thing that renders.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline font files. Vite inlines any asset under 4 kB, which caught
    // a 2 kB JetBrains Mono Cyrillic subset and embedded it as a data: URI in
    // the critical CSS — defeating the whole point of `unicode-range`, since
    // those bytes then ship to every visitor including the ones who will never
    // render a Cyrillic glyph. As a separate file it is simply never requested.
    // It also keeps the CSP at `font-src 'self'` with no `data:` escape hatch.
    assetsInlineLimit: (filePath) => (filePath.endsWith('.woff2') ? false : undefined),
  },
})
