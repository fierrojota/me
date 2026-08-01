# Monorepo & Infra Base

**Slug:** 01-infra-base
**Branch:** feature/01-infra-base
**PR:** none (merged locally, bootstrap feature)
**Merged:** 2026-07-22

## Summary

Scaffolded the web-only Turborepo monorepo (PRODUCT.md `**Layers:** web`) — React + Vite web app, Playwright e2e, Storybook design-system catalog, shared domain/config packages, and CI. Mid-build, DESIGN.md was replaced with the "Kinetic Logic | Lime" palette (brutalist dark UI) based on a new mockup; placeholder screens were updated to match.

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Web app renders at localhost:3001 with project title | ✓ |
| AC-2 | Quality gates (lint, type-check, test) pass | ✓ |
| AC-3 | Storybook UI catalog reachable at localhost:6006 | ✓ |

## Files Added / Modified

| File | Change |
|------|--------|
| `apps/web/` | New Vite + React app |
| `apps/e2e/` | New Playwright e2e suite |
| `packages/ui/` | New Storybook design-system package (Welcome component) |
| `packages/domain/`, `packages/config/` | New shared packages |
| `.github/workflows/ci.yml` | New CI pipeline (lint, type-check, test, e2e) |
| `DESIGN.md` | Replaced with Kinetic Logic | Lime palette |
| `PRODUCT.md` | Added `**Layers:** web`, Challenges/stats core feature |

## Patterns Introduced

- `**Layers:**` field in PRODUCT.md drives which apps/packages `/j-flow-scaffold` generates — this project is web-only (no api/mobile/admin)
- Single dark theme only — no light mode; DESIGN.md's "Light mode" table intentionally mirrors dark tokens

## Test Coverage

- Unit: `pnpm --filter @me/web test`
- E2E (Playwright): `pnpm --filter @me/e2e test`
