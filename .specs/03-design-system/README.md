# Design System

**Slug:** 03-design-system
**Branch:** feature/03-design-system
**PR:** (created below)
**Merged:** pending

## Summary

Built the design system foundation (`packages/ui`): tokens, 5 React primitives (Button, Chip, Card, Input, Nav), CSS-only Typography/Grid utilities, full Storybook coverage (incl. `addon-vitest`, `addon-docs`, `addon-a11y`), and an i18n foundation (`i18next`, English primary/Spanish second) in `apps/web` — the reusable base every later page (landing, blog) draws from.

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Design tokens as CSS custom properties, consumable via `workspace:*` | ✓ |
| AC-2 | Button primitive (primary/secondary, focus/keyboard) | ✓ |
| AC-3 | Chip primitive (neutral/success/error) | ✓ |
| AC-4 | Card primitive (with/without header) | ✓ |
| AC-5 | Typography utilities matching DESIGN.md scale | ✓ |
| AC-6 | Storybook story per primitive, all variants/states | ✓ |
| AC-7 | Layout/Grid responsive utilities + container-max | ✓ |
| AC-8 | Input primitive (focus state, keyboard reachable) | ✓ |
| AC-9 | Nav primitive (active state, keyboard navigable) | ✓ |
| AC-10 | i18n foundation (en primary, es second, browser-detect) | ✓ |

## Files Added / Modified

| File | Change |
|------|--------|
| `packages/ui/src/tokens.css`, `typography.css`, `layout.css` | New — design tokens + CSS-only utilities |
| `packages/ui/src/components/{Button,Chip,Card,Input,Nav}.tsx` + `.css` + `.stories.tsx` + `.test.tsx` | New — 5 primitives, full coverage |
| `packages/ui/src/components/{Typography,Grid}.stories.tsx` | New — story-only utility showcases |
| `packages/ui/src/index.ts` | Modified — barrel exports + token/utility side-effect imports |
| `packages/ui/.storybook/{main.ts,preview.tsx}` | Modified — dark-canvas decorator, `addon-vitest`/`addon-docs`/`addon-a11y` |
| `packages/ui/vitest.config.ts`, `tsconfig.json`, `setup-tests.ts` | New — test tooling (unit + storybook-as-test projects) |
| `apps/web/src/lib/i18n.ts`, `i18n.test.ts` | New — i18next foundation |
| `apps/web/public/locales/{en,es}/common.json` | New — example translation namespace |
| `apps/web/src/main.tsx`, `index.css` | Modified — wired tokens/i18n, removed duplicate hardcoded hex |
| `packages/ui/src/components/Welcome.{tsx,css}` | Modified — removed dead light-theme variant, uses canonical tokens |

## Patterns Introduced

- Design tokens: CSS custom properties under `[data-theme="dark"]`, 1:1 with `DESIGN.md`'s token table.
- Typography/Grid as CSS-only utility classes (no wrapper components) — native-HTML-first per code-style rule 3.
- `vitest.config.ts` with two `test.projects`: `unit` (jsdom + RTL) and `storybook` (real Chromium via `@storybook/addon-vitest`, runs every story as a test incl. `addon-a11y` axe checks).
- i18n: `i18next` + `react-i18next` + `i18next-browser-languagedetector` + `i18next-http-backend`, static-imported (gates rendering, not idle-deferrable like an error-tracking SDK), `fallbackLng: 'en'`, locale JSON served as static assets under `public/locales/{lng}/{ns}.json`.

## Test Coverage

- Unit + Storybook-as-test: `pnpm --filter @me/ui test` (33 tests: component unit tests + every story run in real Chromium with a11y checks)
- Web unit: `pnpm --filter @me/web test` (11 tests, incl. i18n fallback/key-parity checks)
- E2E (Playwright): `pnpm --filter @me/e2e test`
- Visual: `pnpm --filter @me/ui storybook` (dev) / `pnpm --filter @me/ui build-storybook` (CI check)
