# QA Report — 07-brand-alignment
Date: 2026-10-08
Gate: green

## Test Results

| Stage | Status | Details |
|-------|--------|---------|
| 1. Lint + type-check | ✓ PASS | Root `pnpm lint` fails with `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command "eslint" not found` (shell/root-script issue, not a code issue). Ran per package instead: `pnpm --filter @me/{web,ui,e2e} lint` (oxlint) all exit 0, no output. `pnpm type-check`: 3/3 tasks successful (@me/ui cache hit) |
| 2. Unit tests | ✓ PASS | `CI=true pnpm test` exit 0. @me/web: 43 tests / 8 files. @me/ui: 38 tests / 14 files (unit + Storybook-as-test). Coverage (`@me/web test:coverage`): 99.23% stmts, 87.3% branch, 95.45% funcs, 99.23% lines. Changed files: Builder, Connect, Hero, builder.ts, i18n.ts, error-boundary.tsx 100%; Header.tsx 100% lines (66.66% branch, line 39). No coverage thresholds configured in the project, so none failed |
| 3. NestJS E2E | N/A | No api layer |
| 4. Flutter integration | N/A | No mobile layer |
| 5. Playwright E2E | ✓ PASS | `pnpm --filter @me/e2e test`: 10/10 passed (health 1, home 8, nav-underline 1), first run, no flakes, so no re-run needed |
| 6. Visual smoke | ✓ PASS | Storybook: `pnpm --filter @me/ui build-storybook` completed successfully (only the usual "module level directives" / chunk-size warnings from Storybook tooling) · Widgetbook: N/A (no mobile) |
| 7. Manual checklist | ✓ PASS (user-confirmed) | 9/9 rows confirmed by user at build smoke check 2026-10-08. Not re-walked here; see caveat below |

## Extra automated checks (mapped to ACs)

| Check | Result |
|-------|--------|
| Forbidden content grep (`UBB`, `Bio Bio`, `buymeacoffee`, `newsletter`, `consultor`, `colaboraciones`, case-insensitive) in `apps/web/src`, `apps/web/public`, `apps/web/index.html` | PASS: 0 text matches. One false positive in binary `apps/web/public/apple-touch-icon.png` (byte match, ignored via `-I`) |
| `pnpm --filter @me/web build` | PASS (exit 0). `dist/index.html` has `<html lang="es" data-theme="dark">`; `dist/llms.txt` exists; `dist/manifest.json` has `"lang": "es"` |
| en/es `home.json` key parity | PASS: 60 keys each, symmetric difference empty |

## Failures

None.

## Notes / suspicious

- Root `pnpm lint` is broken in this shell (`eslint` not found). Per-package oxlint runs were used. Worth checking the root `lint` script, since CI may use turbo directly.
- `CLAUDE.md` says locales live in `apps/web/public/locales/{en,es}/`. They are actually bundled at `apps/web/src/locales/{en,es}/home.json` (i18next-http-backend was removed). `CLAUDE.md` is stale. The key parity check and forbidden-content grep used the real path; the grep over `apps/web/src` covers it.
- Manual-checklist caveat: the visual items were NOT machine-verified in this run: Builder fits 1024x768 without scroll, footer link row at 320px/375px without overflow, hero headline wrap on mobile, and the axe check (desktop and 375px). They rest on the user's confirmation only. The Playwright specs do cover the Spanish forcing with stored `en`, no toggle in the mobile menu, and the Connect scroll.
- Several checks (LinkedIn/YouTube footer order, `rel="noopener noreferrer"`, pillars text) were not independently verified beyond what unit/e2e tests assert.

## Manual Checklist Results

All rows: PASS, confirmed by user at build smoke check 2026-10-08 (not machine-verified in this QA run).

| # | Item | Result |
|---|------|--------|
| 1 | AC-1 Stored `en` / English browser still shows Spanish, `lang=es` | PASS |
| 2 | AC-1 ErrorBoundary fallback in Spanish | PASS |
| 3 | AC-2 No language control on desktop or mobile menu | PASS |
| 4 | AC-3 Hero headline + untouched chip/CTAs | PASS |
| 5 | AC-4 Bio, pillars line, no forbidden details, fits 1024x768 | PASS |
| 6 | AC-5 Connect subtitle without service offer | PASS |
| 7 | AC-6 YouTube footer link, order, no overflow at 320px | PASS |
| 8 | AC-7 `index.html`, `llms.txt`, `manifest.json` in Spanish | PASS |
| 9 | AC-8 lint, type-check, unit, e2e, axe green | PASS |
