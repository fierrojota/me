# System spec — infra

> Source of truth for the current behavior of this domain.
> Auto-updated by `/j-flow-finish`. Do not edit manually outside of a finish run.
> Last updated: 2026-07-24 by feature `02-observability`

## Behaviors

### 01-infra-base — Monorepo scaffold (web-only layer) (2026-07-22)

- **AC-1** — Web app renders: **Given** `pnpm install` has completed, **When** `pnpm --filter @me/web dev` is run, **Then** app is reachable at http://localhost:3001 and page body contains the project title
- **AC-2** — Quality gates pass: **Given** the scaffolded monorepo with no user changes, **When** `pnpm lint && pnpm type-check && pnpm test` are run, **Then** all commands exit 0 and zero TypeScript errors across all packages
- **AC-3** — UI catalog is reachable: **Given** all dependencies are installed, **When** Storybook is started, **Then** it shows the Welcome story at http://localhost:6006

### 02-observability — apps/web env var inventory extended (2026-07-24)

- **AC-3** (see `.specs/_system/observability.md` for full behavior) — `apps/web/.env.example` gains 5 `VITE_SENTRY_*` vars (DSN, trace/replay sample rates, reporting level); real values stay in gitignored `apps/web/.env`, never committed. No Docker/CI changes — GlitchTip is managed cloud, no local service added.

### 05-deploy — Production hosting (2026-07-29)

- Deploy done directly via Vercel dashboard (repo import), no spec flow run — no `.specs/05-deploy/` folder. No `vercel.json`, no deploy step in `.github/workflows/ci.yml` — Vercel builds/deploys from its own dashboard config on push, independent of this repo's CI. Live at `https://jotafierro.me/`.

<!-- next feature entries are appended above this line -->
