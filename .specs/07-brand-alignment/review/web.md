# Manual Testing — 07-brand-alignment Web

Browser smoke tests. Run against the local dev server.

## Setup

```bash
pnpm --filter @me/web dev     # :3001
```

---

## 1. Spanish is the only language (AC-1)

1. Open DevTools → Application → Local Storage, set `i18nextLng` = `en`, reload http://localhost:3001/
2. Expected: all copy in Spanish; `document.documentElement.lang` is `es`
3. Repeat in a profile/browser whose language is English (or with `navigator.language` overridden)
4. Expected: still Spanish; no `i18nextLng` written to localStorage on a clean profile
5. Force an error (temporarily throw in a component) → fallback reads "Algo salió mal" / "Intenta navegar a otra parte."

## 2. Language toggle hidden (AC-2)

1. Desktop ≥1024px: header shows brand + 4 nav links, no globe / EN / ES control; links look centered
2. Resize <768px, open the menu: 4 links, active one lime + underlined, no language control
3. Tab through the header: focus never lands on a language control

## 3. Hero positioning (AC-3)

1. Hero headline reads "EL INGENIERO QUE LE PONE **PROCESO A TODO** — AL CÓDIGO Y A LA VIDA." (highlight in lime with underline)
2. Status chip and both CTAs keep their terminal-style wording; no hire/services claim in the subcopy

## 4. Builder bio and pillars (AC-4)

1. Facts list shows: role, stack, philosophy, `> OFFLINE: Esposo · Papá de dos hijas · Entreno básquetbol 🏀`, `> PILARES: Ingeniería y carrera · Vida en construcción · Biblioteca`
2. Quote mentions 5:30–9:30 AM
3. No daughters' names/ages/photos, no money figures, no degree mention
4. At 1024×768 the Builder section fits without internal scroll

## 5. Connect without service offer (AC-5)

1. Subtitle reads "¿Una pregunta, una idea o un comentario sobre algo que publiqué? Escríbeme."
2. No "colaboraciones", no "Q{n} {year}"; email CTA (mailto) still works

## 6. YouTube link (AC-6)

1. Footer lists GITHUB / LINKEDIN / YOUTUBE / EMAIL in that order
2. YOUTUBE opens https://www.youtube.com/@fierrojota in a new tab (`rel="noopener noreferrer"`)
3. At 320px and 375px the footer link row has no horizontal overflow
4. No extra button next to the email CTA

## 7. Metadata (AC-7)

1. View source: `<html lang="es">`, new title/description, no mention of services/newsletter/support
2. Open http://localhost:3001/llms.txt: Spanish, lists Pilares and the YouTube channel; `manifest.json` has `"lang": "es"`

## 8. Quality gates (AC-8)

```bash
pnpm lint && pnpm type-check && pnpm test
pnpm --filter @me/e2e test
```
Run axe (DevTools or Storybook a11y) on `/` at desktop and 375px: no new violations.

---

## Checklist

| AC | Scenario | Pass |
|----|----------|------|
| AC-1 | Stored `en` / English browser still shows Spanish, `lang=es` | [x] |
| AC-1 | ErrorBoundary fallback in Spanish | [x] |
| AC-2 | No language control on desktop or mobile menu | [x] |
| AC-3 | Hero headline + untouched chip/CTAs | [x] |
| AC-4 | Bio, pillars line, no forbidden details, fits 1024×768 | [x] |
| AC-5 | Connect subtitle without service offer | [x] |
| AC-6 | YouTube footer link, order, no overflow at 320px | [x] |
| AC-7 | `index.html`, `llms.txt`, `manifest.json` in Spanish | [x] |
| AC-8 | lint, type-check, unit, e2e, axe green | [x] |
