# Manual Testing — 03-design-system Web

No page ships in this feature — verification is via Storybook (`packages/ui`) plus a plain-browser sanity check that `apps/web` still boots with tokens/i18n wired in.

## Setup

```bash
pnpm --filter @me/ui storybook             # :6006
pnpm --filter @me/web dev                  # :3001
pnpm --filter @me/ui test                  # Vitest + RTL unit tests
pnpm --filter @me/web test                 # i18n unit test (i18n.test.ts)
```

---

## 1. Design tokens (AC-1)

1. Open http://localhost:3001, DevTools → Elements → `<html data-theme="dark">`.
2. Expected: computed styles show `--primary-container: #bef264`, `--surface-container: #171f33`, etc. (values match `DESIGN.md` 1:1).
3. Confirm `apps/web/src/index.css` no longer defines its own `--color-bg`/`--color-fg`/`--color-primary` — `.app-shell`/`.app-title` now reference the canonical token names.

## 2. Button (AC-2)

1. Storybook → `Button` → `Primary` story.
2. Expected: lime (`#bef264`) bg, dark text, sharp corners, JetBrains Mono bold/uppercase.
3. `Secondary` story: transparent bg, 1px lime border, lime text.
4. Tab to the button, expected: visible focus ring. Press Enter/Space, expected: `onClick` fires (see Actions panel).

## 3. Chip (AC-3)

1. Storybook → `Chip` → `Neutral`/`Success`/`Error` stories.
2. Expected: bordered, JetBrains Mono text; success = lime; error = red; each visually distinct.

## 4. Card (AC-4)

1. Storybook → `Card` → default story (no header) and with-header story.
2. Expected: sharp corners, `surface-container` bg, 1px border, no shadow; header variant shows a bottom border separating header from body.

## 5. Typography (AC-5)

1. Storybook → `Typography` showcase story.
2. Expected: each `.text-*` class renders with the exact size/weight/line-height/letter-spacing from `DESIGN.md`'s type scale table — headline in Geist, labels in JetBrains Mono.

## 6. Storybook coverage (AC-6)

1. Storybook sidebar — confirm a story exists for: Button, Chip, Card, Input, Nav, Typography (showcase), Grid (showcase).
2. Expected: every interactive primitive has stories for its documented states (default, hover, focus, disabled where applicable).

## 7. Layout/Grid (AC-7)

1. Storybook → `Grid` showcase story, resize the preview viewport.
2. Expected: 4-col under 768px, 8-col 768–1023px, 12-col ≥1024px; a `.container-max` element caps at 1280px width.

## 8. Input (AC-8)

1. Storybook → `Input` story.
2. Expected: `surface-container` bg, 1px border; click/Tab into the field — border shifts to lime with inner stroke.
3. Tab to the input using only the keyboard — expected: visible focus state.

## 9. Nav (AC-9)

1. Storybook → `Nav` story (wrapped in `MemoryRouter`).
2. Expected: brand slot + text links + optional CTA slot render per mockup header; the active link renders in lime.
3. Tab through the links — expected: visible focus ring on each, in document order.

## 10. i18n foundation (AC-10)

1. DevTools → Application → Local Storage → `http://localhost:3001` — expected key written by the language detector after first load (`i18nextLng` or equivalent).
2. Change browser/OS language to Spanish, clear localStorage, reload — expected: detector picks `es` on first visit (verify via a temporary `console.log(i18next.language)` or the Network tab showing a fetch to `/locales/es/common.json`).
3. Clear locale override, reload with a non-Spanish browser language — expected: falls back to `en` (`/locales/en/common.json` fetched).
4. Run `pnpm --filter @me/web test` — expected: `i18n.test.ts` passes (matching keys in `en`/`es`, fallback-to-`en` behavior).
5. Confirm `apps/web` still boots without console errors (i18n init doesn't crash the app even though no component calls `useTranslation()` yet).

---

## Checklist

| AC | Scenario | Pass |
|----|----------|------|
| AC-1 | Tokens present as CSS custom properties, duplicate hex vars removed | [x] |
| AC-2 | Button primary/secondary variants + focus/keyboard | [x] |
| AC-3 | Chip neutral/success/error variants | [x] |
| AC-4 | Card with/without header | [x] |
| AC-5 | Typography scale matches DESIGN.md | [x] |
| AC-6 | Storybook story exists per primitive | [x] |
| AC-7 | Grid/container-max responsive at 3 breakpoints | [x] |
| AC-8 | Input focus state + keyboard reachable | [x] |
| AC-9 | Nav active state + keyboard navigable | [x] |
| AC-10 | i18n detects browser language, falls back to en, unit test passes | [x] |
