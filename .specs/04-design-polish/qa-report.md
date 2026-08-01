# QA Report — 04-design-polish
Date: 2026-07-29
Gate: green

## Test Results
| Stage | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | `npx turbo lint` — @me/web: 0 warnings, 0 errors (103 rules, 30 files) |
| Unit tests | ✓ PASS | `CI=true npx turbo run test --filter=@me/web --filter=@me/ui` — @me/ui 39 tests (15 files, incl. Storybook-as-test via `@storybook/addon-vitest`), @me/web 42 tests (8 files) |
| NestJS E2E | N/A | No backend/api layer in this feature (`PRODUCT.md` Layers: web) |
| Flutter tests/integration | N/A | No mobile layer in this feature |
| Playwright E2E | ✓ PASS | `npx playwright test` (from `apps/e2e`) — 9/9 tests across all 3 spec files: `home.spec.ts` (7, new), `nav-underline.spec.ts` (1, pre-existing), `health.spec.ts` (1, retired/updated) |
| Visual smoke | ✓ PASS | `pnpm --filter @me/ui build-storybook` — built clean (only Storybook's own dev-tooling "chunk >500kB" warning, not shipped in the site, per prior agent-memory note); no Widgetbook (no mobile layer) |
| Manual checklist | ✓ PASS (carried forward) | `review/web.md`'s 11 AC rows (AC-1 through AC-13, minus removed AC-6/AC-7) all show `[x]` from build-time smoke checks across revisions 2–12 — not re-walked in this pass, see note below |

## Failures (if any)
None on final run. One transient authoring bug in the new `home.spec.ts` was found and fixed before the final green run:

- `builder section shows image + both stat cards (AC-3)` initially failed: `page.getByText('INNOVATION')` hit Playwright's default case-insensitive substring matching and resolved to 2 elements (the `INNOVATION` stat heading AND the pull-quote's "...witty, **innovati**on-first approach..." text) — strict-mode violation. Fixed by switching to `page.getByRole('heading', { name: 'INNOVATION' })` (and the sibling `CLEAN_ARCH` assertion, for consistency/future-proofing against the same collision). Not a product bug — a test-locator specificity issue.

Also noted (non-blocking, environmental): the initial combined `pnpm test` run failed because a leftover `vite` dev server process from the same session's prior test attempt was already bound to port 3001, conflicting with Playwright's `webServer` (`reuseExistingServer: !CI`). Killed the stray process and re-ran; unrelated to any source change.

## Work done this pass (per review-guide.md's standing QA obligation)

- **Added `apps/e2e/tests/home.spec.ts`** (7 tests) — the file review-guide.md flagged as "still owed at `/j-flow-qa`". Covers, using real copy from `apps/web/public/locales/{en,es}/home.json`:
  - Header wordmark + 4 nav links visible; brand link scrolls to Hero (AC-1)
  - Hero headline + both CTAs visible (AC-2)
  - Builder image + both stat cards visible (AC-3)
  - All 4 project cards render as `<a>` elements (not `<div>`, per revision 12) with correct titles (AC-4)
  - Connect's bordered CTA card + nested `<footer>` (brand/links, no tagline) + email `mailto:` link visible; asserts no `.cta-band` exists and exactly one `<footer>` on the page (AC-5)
  - Clicking `03_CONNECT` scrolls the Connect section fully below the sticky header (AC-1)
  - Selecting `ES` updates the hero headline live, verified no page reload occurred via a `window` marker surviving the language switch (AC-11)
- **Retired the stale assertion in `apps/e2e/tests/health.spec.ts`**: the old `toContainText('me')` check (a substring match against literally any use of the word "me" on the page) no longer tested anything meaningful post-redesign. Replaced with a minimal smoke check — page loads with an OK response and the real `<title>` ("Jota Fierro — Software Engineer") renders — deliberately thin since `home.spec.ts` now owns the detailed assertions.
- Left `apps/e2e/tests/nav-underline.spec.ts` untouched, as instructed.

## Manual Checklist Results

`review/web.md`'s checklist (14 numbered scenarios, 11 AC rows) is fully `[x]` — carried forward from build-time smoke checks recorded incrementally across revisions 2 through 12 in `gate-context.md` (most recent: "smoke check ui (revision 12) 2026-07-29 — AC-4"). Per this task's instructions, these were **not re-walked live** in this QA pass; only spot-verified that the checklist table itself shows all 11 AC rows checked. If a live manual re-walk is later desired (e.g. before `/j-flow-review`), that would need to happen as a separate explicit step.

## Gate Decision

All applicable stages (Lint, Unit, Playwright E2E, Visual smoke) pass; NestJS E2E and Flutter are correctly N/A for this `ui`-only feature. Manual checklist carried forward green from build-time confirmation.

**Gate: green**
