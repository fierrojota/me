# Functional Spec — 01-infra-base
Date: 2026-07-21

## Purpose

Establish the monorepo scaffold so all subsequent features have a working, runnable base.

## Feature users

Engineering team — every developer who runs, tests, or builds this project.

## Trigger

/j-flow-scaffold run by the project lead at project initialization.

## Acceptance criteria

### AC-1 — Web app renders

**Given** `pnpm install` has completed
**When** `pnpm --filter @me/web dev` is run
**Then:**
- App is reachable at http://localhost:3001
- Page body contains the project title

### AC-2 — Quality gates pass

**Given** the scaffolded monorepo with no user changes
**When** `pnpm lint && pnpm type-check && pnpm test` are run
**Then:**
- All commands exit with code 0
- Zero TypeScript errors across all packages

### AC-3 — UI catalog is reachable

**Given** all dependencies are installed
**When** Storybook is started
**Then:**
- Storybook shows the Welcome story at http://localhost:6006

## Scope

**In scope:**
- Root monorepo config (turbo, pnpm workspaces, CI)
- apps/{web, e2e} and packages/{ui, domain, config}
- Smoke tests, welcome screens

**Out of scope:**
- Any product feature (auth, users, etc.)
- Production deployment config
- apps/api, apps/admin, apps/mobile — not declared in PRODUCT.md `**Layers:**` (currently `web` only)

## Dependencies

None — this is the foundation feature.

## Edge cases

- Default theme falls back to asking user if DESIGN.md has no default specified (not needed here — DESIGN.md declares `**Default mode:** dark`)
- If PRODUCT.md's `**Layers:**` field is later updated to add `api`/`mobile`/`admin`, re-run `/j-flow-scaffold` to generate those apps

## Risks

- CLI version drift: always use `@latest` flags
