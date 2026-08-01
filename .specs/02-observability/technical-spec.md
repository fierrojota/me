# Technical Spec — Observability
Date: 2026-07-22

## Architecture Overview

Same pattern as the `aura` reference: `@sentry/react` initialized once at app boot, wrapping the tree in `Sentry.ErrorBoundary`, with `browserTracingIntegration()` and `replayIntegration()` registered at init time. No new architectural layer — this is SDK wiring inside the existing `apps/web` Vite app.

```
main.tsx
  └─ initSentry()                 (apps/web/src/lib/sentry.ts, reads import.meta.env)
       └─ Sentry.init({ dsn, release, integrations: [browserTracing, replay], ... })
  └─ <Sentry.ErrorBoundary fallback>
       └─ <App />                 (unchanged)

Runtime error → React tree → Sentry.ErrorBoundary → Sentry.captureException (built-in)
                                                    → fallback UI rendered
Page load / navigation → BrowserTracing integration → transaction → GlitchTip (Sentry-protocol ingest)
Active session → Replay integration → session replay → GlitchTip
```

GlitchTip (`app.glitchtip.com/26058`) is a drop-in Sentry-protocol ingest endpoint (AC-3) — no SDK fork or custom transport needed, only the DSN differs from an actual Sentry DSN.

## Data Layer
N/A — no MongoDB involved (client-side SDK only, no persistence in this repo).

## Service Layer
N/A — no NestJS/backend layer in this repo (CONSTITUTION P3, PRODUCT.md `**Layers:** web`).

## API Layer
N/A — no backend layer; GlitchTip cloud is the only external endpoint and is called directly by the SDK's built-in transport (no proxy endpoint).

## Frontend

**Routes:** none new — no user-facing UI (functional spec: "no user-facing changes").

**Components:**
- `apps/web/src/lib/sentry.ts` (new) — exports `initSentry()` and a small pure `meetsLevelThreshold(level, threshold)` helper used by `beforeSend`.
- `apps/web/src/lib/error-boundary.tsx` (new) — dependency-free `class extends Component` error boundary (not `Sentry.ErrorBoundary` — see DD-1 revision below), renders the same minimal fallback markup as originally spec'd (dark-theme tokens from `index.css`).
- `apps/web/src/main.tsx` (edit) — wraps `<App />` in the new `ErrorBoundary`; defers `initSentry()` via a code-split dynamic `import('./lib/sentry')` called from `requestIdleCallback` (with `setTimeout` fallback), instead of a static top-level import + synchronous call at boot.

No other component tree changes — `App.tsx` is untouched.

**Revision (post-review, 2026-07-23):** the original design (`Sentry.ErrorBoundary`, static `@sentry/react` import, synchronous `initSentry()` at boot) regressed the initial JS bundle by +89.34 kB gzip (+149%), violating CONSTITUTION P1 (Core Web Vitals must not regress). Fixed by splitting "can catch/report an error" (available immediately, zero SDK dependency) from "tracing/replay integrations are active" (deferred, code-split, loaded off the critical path). Net regression after fix: +1.16 kB gzip. AC-1/2/4/5/6 behavior is unchanged — only load timing changed.

**State:** No React Query or Zustand involvement — Sentry SDK owns its own internal state; nothing surfaced to app state.

**Forms:** N/A.

## Mobile
N/A — no mobile layer in this project (web-only, PRODUCT.md `**Layers:** web`).

## Infrastructure

**New env vars** (all read via `import.meta.env.*`, Vite's native env handling — no config abstraction):

| Var | Default | AC |
|---|---|---|
| `VITE_SENTRY_DSN` | `""` (empty) | AC-2, AC-3 |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | `0.2` | AC-4 |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | `0.1` | AC-5 |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | `1.0` | AC-5 |
| `VITE_SENTRY_LEVEL` | `warning` | AC-6 |

No `VITE_SENTRY_ENVIRONMENT` var — the `environment` tag uses Vite's built-in `import.meta.env.MODE` (`development`/`production`) directly, since AC-2 only requires the tag, not a configurable override (P2 — no config for a value the AC doesn't ask to vary).

- `apps/web/.env.example` (new) — documents all five vars above, `VITE_SENTRY_DSN=` left empty (AC-3).
- `apps/web/.env` (gitignored, already covered by root `.gitignore`'s `.env` entry) — holds the real GlitchTip DSN locally; not created by this feature, developer creates it from `.env.example`.
- Release tag: `import { version } from '../../package.json'` (Vite's native JSON-import support — no build-time `define` plugin needed) sourced from `apps/web/package.json` `version` field (AC-2).

**Docker services:** none — GlitchTip is the existing managed cloud project (`app.glitchtip.com/26058`), no local container (code-style rule 5).

**CI changes:** none — CI has no `VITE_SENTRY_DSN` secret; SDK no-ops with empty DSN during CI builds/tests (AC-2), so no workflow edits are required.

## Cross-cutting Concerns

**Auth:** N/A — no auth in this repo (PRODUCT.md).

**Validation:** N/A — no user input; env vars are read as-is and passed straight to `Sentry.init()` options (sample-rate vars are parsed with `Number(...)`, falling back to the documented default if `NaN`/unset — this is the only parsing logic in `sentry.ts`).

**Error handling:**
- Errors thrown in the React tree are caught by `Sentry.ErrorBoundary`, which calls `Sentry.captureException` internally with the component stack (AC-1) — no hand-rolled `componentDidCatch`.
- Fallback UI: minimal static markup ("Something went wrong" + dark-theme tokens), no retry logic — client-side navigation (`react-router-dom`, already a dependency) still works after the error since only the boundary's subtree unmounts, satisfying "subsequent navigation recovers normal app state" (AC-1).
- `beforeSend` hook in `sentry.ts` drops any event whose `event.level` ranks below `VITE_SENTRY_LEVEL` in the fixed order `['debug', 'info', 'warning', 'error', 'fatal']` (AC-6) — the only custom logic in this feature, kept as one pure function so it's unit-testable in isolation.
- Empty/missing `VITE_SENTRY_DSN` is handled entirely by Sentry's own SDK behavior: calling `Sentry.init({ dsn: '' })` is a documented no-op (SDK logs a warning, sends nothing) — no `if (dsn)` branch needed in app code (AC-2, code-style rule 2: use the SDK primitive instead of reimplementing the no-op check).

**Logging:** No new app-level logging. GlitchTip dashboard is the sole destination for captured errors, transactions, and replays — nothing written to browser console beyond Sentry's own SDK debug logs (off by default).

## Design decisions

- **DD-1 — `Sentry.ErrorBoundary` component vs. hand-rolled `class extends React.Component` with `componentDidCatch` (REVISED post-review 2026-07-23):** originally chose `Sentry.ErrorBoundary` (see rationale below), but this forced a static `@sentry/react` import into the initial bundle, regressing Core Web Vitals (CONSTITUTION P1). Switched to a hand-rolled boundary (`apps/web/src/lib/error-boundary.tsx`) whose `componentDidCatch` dynamically `import()`s `@sentry/react` to call `captureException` with the component stack — same reporting behavior (AC-1), but the SDK is no longer a hard dependency of the boundary component itself, allowing it to be code-split. Trade-off: an error thrown before the deferred SDK import resolves is not captured (no queue/buffer) — acceptable for a personal portfolio site, documented as a `ponytail:` comment in the boundary file.
  - Original rationale (superseded): `Sentry.ErrorBoundary` calls `captureException` with the component stack automatically and accepts a `fallback` render prop — a hand-rolled boundary would duplicate that capture call for no behavioral difference (AC-1, code-style rule 2).

- **DD-2 — Single `@sentry/react` package vs. separate `@sentry/tracing` + `@sentry/replay` packages:** use the unified `@sentry/react` package, which exports `browserTracingIntegration()` and `replayIntegration()` directly. The split-package API is the deprecated pre-v8 shape; one dependency instead of three (AC-4, AC-5).

- **DD-3 — `import.meta.env` read directly in `sentry.ts` vs. a dedicated config/env-schema module:** read `import.meta.env.VITE_SENTRY_*` inline in `initSentry()`. Five flat values used in exactly one file don't justify a schema/validation layer (P2, code-style rule 3 — no abstraction without 3+ reuse sites).

- **DD-4 — Level filtering via `beforeSend` comparison array vs. a third-party log-level library:** implement `meetsLevelThreshold` as one small ordered-array lookup. Sentry has no built-in "minimum level" option, and the five-value fixed set (AC-6) doesn't warrant pulling in a level library for one comparison.

- **DD-5 — Relying on Sentry's built-in empty-DSN no-op vs. an explicit `if (dsn)` guard before calling `init()`:** rely on the SDK's documented behavior. Adding a guard would be dead code duplicating what `Sentry.init` already does when `dsn` is falsy (AC-2).

## Testing Strategy

**Unit tests (Vitest, `apps/web`):**
- `meetsLevelThreshold` (in `sentry.ts`): table test covering all 5 levels against a threshold (e.g. `warning` blocks `debug`/`info`, allows `warning`/`error`/`fatal`) — covers AC-6.
- Error boundary fallback: extend `App.test.tsx` (or a sibling test file) with a component that throws, rendered inside the same `Sentry.ErrorBoundary` + `fallback` used in `main.tsx`, asserting the fallback text renders instead of a blank tree — covers AC-1.
- `initSentry()` with `VITE_SENTRY_DSN` unset: assert it does not throw (smoke test) — covers AC-2 edge case.

**Playwright E2E (`apps/e2e`):** no new user-facing journey to add — functional spec states "no user-facing changes" and public visitors are unaffected. Existing smoke test (home page loads) already covers that `Sentry.init()` running at boot doesn't break page load or introduce console errors; no additional spec needed.
