# Review Findings — 04-design-polish
Date: 2026-07-29

## Constitution check

✓ P1 — performance-first: no new deps, 3 orphaned placeholder images deleted, treemap is a cheap single-digit-N computation.
✓ P2 — simplicity over cleverness: no residual dead code from the sizing-mechanism redesign (confirmed via grep — old tier classes/functions fully removed).
✓ P3 — scope stays inside declared Layers: web-only.
✓ P4 — accessible, semantic markup: card anchors have `aria-label` + native `:focus-visible`, no hardcoded hex values.
✓ P5 — full-height, page-like sections: AC-13 mechanism confirmed unaffected by the treemap rework.

Constitution: 5 principles checked, all pass.

## Critical (must fix before approval)
None found. Every implemented file traces cleanly to a technical-spec DD and a functional-spec AC; no speculative code beyond `tasks.json`'s 17 tasks.

## Major (should fix)
None found. Security (no secrets in spec docs, correct `noopener noreferrer` pairing on all 3 outbound links), a11y (no nested interactive elements, `aria-label` per DD-48, focus-visible everywhere), and performance (no new dependency, rAF-gated scroll listener) all check out.

## Minor (optional) — outcome: fixed

- `apps/web/src/pages/home.css` — `.site-header { width: auto }` was a no-op (`position: sticky` doesn't change default block width). **Fixed:** declaration removed.
- `apps/web/src/pages/home.css` — `.site-header__logo { vertical-align: middle }` had no effect (parent is `display: inline-flex`; `vertical-align` doesn't apply to flex items). **Fixed:** declaration removed.
- `apps/web/src/index.css` — `.app-title` was dead (leftover from the pre-redesign placeholder page, unreferenced anywhere). **Fixed:** rule removed. Correction to an earlier draft of this finding: `.app-shell` is NOT dead — it's used by `ErrorBoundary`'s fallback UI in `apps/web/src/lib/error-boundary.tsx` — kept as-is.

Verified after fix: `type-check`, `lint`, `test` (42/42), `build`, and Playwright e2e (9/9) all pass clean.

## Over-engineering (advisory, non-blocking)

- `apps/web/src/lib/treemap.ts` — flagged by an automated ponytail pass as an over-generalized algorithm for one caller. **Does not apply**: the user explicitly rejected a simpler static-tier design (recorded in `gate-context.md`, revision 11) for not recomputing across arbitrary project counts (2, 3, 5, 6...). The treemap is the corrected, explicitly-requested design, verified working for N=4 and N=5 during the build's manual QA.
- `image`/`imageAlt` fields on `Project` (`apps/web/src/data/projects.ts`) — flagged as unused. **Does not apply**: `functional-spec.md` AC-4 explicitly requires this optional field, and its Edge Cases section explicitly frames the missing screenshots as "a mechanical follow-up, not blocking this feature" — intentional forward-compatibility, not dead code.
- `packages/ui/src/components/Nav.tsx` — the `linkRefs` Map + imperative `setAttribute('aria-current', ...)` loop could likely be simplified to a plain JSX `aria-current` prop + `querySelector` at measurement time. Genuine simplification candidate, not spec-mandated either way. Not blocking — flagged for a future cleanup pass, not this feature.

## Verdict
**approved**
