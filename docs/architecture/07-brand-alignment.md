# Architecture — Brand alignment

Date: 2026-10-09
Slug: 07-brand-alignment

## Architecture Overview

```
Browser loads /
  ↓
index.html  <html lang="es">  (static, pre-JS: crawlers + first paint)            [AC-1, AC-7]
  ↓
main.tsx → import './lib/i18n'
  1. i18n.init({ lng: 'es', ... })                                                  [AC-1]
     1a. explicit `lng` short-circuits LanguageDetector.detect() → stored 'en' / navigator 'en-US' ignored
     1b. detection.caches: [] → nothing written to localStorage while forced
     1c. 'languageChanged' handler sets document.documentElement.lang = 'es'
  ↓
ErrorBoundary → fallback copy read from i18n (error.title / error.body)             [AC-1]
  ↓
HomePage
  ├─ Header    → <Nav> without `cta` prop → no LanguageToggle rendered              [AC-2]
  ├─ Hero      → new es copy (prefix / highlight / suffix + subcopy)                 [AC-3]
  ├─ Builder   → new pillars fact line, updated human fact + quote                   [AC-4]
  ├─ FeaturedSystems (unchanged)
  └─ Connect   → static subtitle (no nextQuarter), footer + YOUTUBE link             [AC-5, AC-6]
```

The EN locale, the `LanguageDetector` plugin, the `languageChanged` → `<html lang>` sync, the `LanguageToggle` primitive and its story all stay in place, unused by the UI (AC-1, AC-2). To bring English back later: remove `lng`, restore `caches: ['localStorage']`, put the `cta` back in Header, and set `index.html` lang. No copy needs rewriting.

## Design decisions

- **DD-1: Hide the toggle by omitting `Nav`'s `cta` prop, no CSS and no `Nav` change.** `Nav` already supports `cta?` and only renders the wrapper when set; the `1fr auto 1fr` grid keeps links centered. Rejected: CSS `display:none` (dead markup, depends on CSS to leave the focus order) and a placeholder slot in `Nav` (abstraction nothing needs). [AC-2]
- **DD-2: Force Spanish with `lng: 'es'`, keep `LanguageDetector` registered with `caches: []`.** An explicit `lng` makes i18next skip `detect()`, so a stored `i18nextLng=en` and an English `navigator.language` are ignored; `caches: []` stops writes to localStorage. Rejected: removing the plugin/dependency (re-enabling would re-add it) and `detection.order: []` with `fallbackLng: 'es'` (two settings for the same result). `fallbackLng` stays `'en'`; the parity test guarantees no key falls back. [AC-1]
- **DD-3: Static `lang="es"` plus the existing runtime sync.** Covers crawlers and pre-JS; the runtime handler confirms `es`. [AC-1, AC-7]
- **DD-4: Pillars as one terminal-style fact line, not cards.** Pure copy matching the `> KEY: value` list, zero CSS (no redesign, rumbo §7.3). Rejected: 3 pillar cards (grid CSS changes, mono labels too wide for ~220px columns, P5 fit risk at 1024px). Pillar 3 is named "Biblioteca", not "Curaduría" (Jota's call, communicated to rumbo). [AC-4]
- **DD-5: Delete `quarter.ts` and its test.** Connect is the only consumer; an unused module goes against P2. [AC-5]
- **DD-6: EN mirrors every new and changed key.** Required by CLAUDE.md and the parity test; keeps re-enabling English copy-free. [AC-1, AC-8]
- **DD-7: ErrorBoundary reads copy via the `i18n` instance (`i18n.t`), not the hook.** Class component outside the React i18n context; the instance is initialized synchronously. Rejected: Spanish literal in the component (hardcoded copy, violates the i18n convention). [AC-1]
