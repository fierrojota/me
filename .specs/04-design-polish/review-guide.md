# Review Guide — 04-design-polish
Generated: 2026-07-25

## Environment

```bash
pnpm --filter @me/web dev              # :3001
```

No API, no MongoDB, no Docker — web-only feature (`PRODUCT.md` Layers: web).

**Required env vars for this feature:** none new.

**Seed data:** none.

## Per-Layer Testing Docs

Run in this order: web (only layer with tasks in this feature).

| Layer | File | ACs covered |
|-------|------|-------------|
| Web   | [review/web.md](review/web.md) | AC-1 – AC-13 |

_No API/mobile/admin review doc — single-layer (ui) feature._

## E2E coverage (mostly written at `/j-flow-qa`; one file already exists)

Per `layer-order.md`, Playwright E2E is normally written by `j-flow-quality` during `/j-flow-qa`, not as a `ui`-layer build task. One exception already shipped ahead of that phase:

- **`apps/e2e/tests/nav-underline.spec.ts` (already exists, revision 8)** — regression test for the scroll-tracked active-section underline bug (rapid first→last nav click under CPU throttling); written during the bug fix itself, not deferred.

Still owed at `/j-flow-qa`:

- **`apps/e2e/tests/home.spec.ts` (new)** — navigates to `/`, asserts in order: header wordmark ("jotafierro.me") + nav links visible, brand link scrolls to Hero (AC-1), hero headline + both CTAs visible (AC-2), Builder section image + both stat cards visible (AC-3), all 4 project cards visible with titles (AC-4), Connect section's bordered CTA card + nested footer (brand/links, no tagline) + email link visible, no separate CTA band/Footer section exists (AC-5). Plus: clicking `03_CONNECT` scrolls the Connect section into view uncovered by the sticky header (AC-1), and selecting `ES` in the language toggle updates visible copy (e.g. hero headline) without a page reload (AC-11).
- **`apps/e2e/tests/health.spec.ts` (update)** — its current `toContainText('me')` assertion no longer tests meaningful content post-redesign (per `technical-spec.md` Testing Strategy) — replace/retire it in favor of `home.spec.ts`'s specific assertions.

If `/j-flow-qa` runs without adding `home.spec.ts`, treat that as a gap — flag it back rather than marking the e2e stage green on `nav-underline.spec.ts`/`health.spec.ts` alone.

## Approval Criteria

Web checklist green → feature approved for `/j-flow-review`.
Any blocker found → run `/j-flow-build --fix`, then re-run `/j-flow-qa`.
