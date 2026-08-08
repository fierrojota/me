import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
