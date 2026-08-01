# Review Findings — 03-design-system
Date: 2026-07-24

## Critical (must fix before approval)

None.

## Major (should fix)

None.

## Minor (optional) — all fixed 2026-07-24

- `packages/ui/src/components/welcome.css:1-3` — the pre-existing `Welcome` demo component's CSS hardcoded `--bg`/`--fg`/`--primary`, byte-identical hex values to the canonical tokens this feature created. **FIXED:** `.welcome`/`.welcome__title` now reference `var(--background)`, `var(--on-surface)`, `var(--primary-container)` directly; local custom properties deleted.

- `packages/ui/src/components/{Button,Input,Nav}.stories.tsx` — no story codified a forced-focus state via `play()`. **FIXED:** added a `Focused` story to each (`Button`, `Input`, `Nav`) asserting `toHaveFocus()` via `storybook/test`'s `expect`. Verified: 33/33 tests pass (up from 30), including the 3 new play-function assertions running under the `storybook (chromium)` project.

- `packages/ui/vitest.config.ts` — DD-9 wording said "copied verbatim" but understated the added `storybook` test project. **FIXED:** DD-9 rewritten to describe both the `unit` project (copied verbatim) and the `storybook` project (added during build smoke-check, `@storybook/addon-vitest`, Chromium via Playwright, Vitest bumped 2→3 repo-wide).

## Verdict

approved
