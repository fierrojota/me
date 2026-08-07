# Architecture — Observability

Date: 2026-07-24
Slug: 02-observability

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

**Revision (post-review, 2026-07-23):** the original design (`Sentry.ErrorBoundary`, static `@sentry/react` import, synchronous `initSentry()` at boot) regressed the initial JS bundle by +89.34 kB gzip (+149%), violating CONSTITUTION P1 (Core Web Vitals must not regress). Fixed by splitting "can catch/report an error" (available immediately, zero SDK dependency) from "tracing/replay integrations are active" (deferred, code-split, loaded off the critical path). Net regression after fix: +1.16 kB gzip. AC-1/2/4/5/6 behavior is unchanged — only load timing changed. In production, this means: `apps/web/src/lib/error-boundary.tsx` is a dependency-free boundary whose `componentDidCatch` dynamically imports `@sentry/react` to report; `main.tsx` defers `initSentry()` via `requestIdleCallback`/`setTimeout` behind a dynamic `import('./lib/sentry')`.

**Revision (audit, 2026-08-07):** `replayIntegration()` was removed. A 4-agent audit measured the SDK at 87.5 kB gzip against an app bundle of 91.5 kB — Replay alone accounted for 39.3 kB of it (126 kB raw), to record a single-page portfolio. Worse for P1, rrweb installs a DOM-wide `MutationObserver`, and `packages/ui/src/components/Nav.tsx` rewrites the indicator's inline styles on every section change, feeding it continuously during scroll (an INP contributor). `browserTracingIntegration()` stays — Web Vitals are what P1 is about. The `Active session → Replay` path above no longer exists, and `replaysSessionSampleRate` / `replaysOnErrorSampleRate` were dropped from the env contract. Separately, the deferred `import('./lib/sentry')` is now guarded by `VITE_SENTRY_DSN`: previously a DSN-less build still downloaded and parsed ~273 kB raw before `Sentry.init()` no-opped.

## Design decisions

- **DD-1 — `Sentry.ErrorBoundary` component vs. hand-rolled `class extends React.Component` with `componentDidCatch` (REVISED post-review 2026-07-23):** originally chose `Sentry.ErrorBoundary` (see rationale below), but this forced a static `@sentry/react` import into the initial bundle, regressing Core Web Vitals (CONSTITUTION P1). Switched to a hand-rolled boundary (`apps/web/src/lib/error-boundary.tsx`) whose `componentDidCatch` dynamically `import()`s `@sentry/react` to call `captureException` with the component stack — same reporting behavior (AC-1), but the SDK is no longer a hard dependency of the boundary component itself, allowing it to be code-split. Trade-off: an error thrown before the deferred SDK import resolves is not captured (no queue/buffer) — acceptable for a personal portfolio site, documented as a `ponytail:` comment in the boundary file.
  - Original rationale (superseded): `Sentry.ErrorBoundary` calls `captureException` with the component stack automatically and accepts a `fallback` render prop — a hand-rolled boundary would duplicate that capture call for no behavioral difference (AC-1, code-style rule 2).

- **DD-2 — Single `@sentry/react` package vs. separate `@sentry/tracing` + `@sentry/replay` packages:** use the unified `@sentry/react` package, which exports `browserTracingIntegration()` and `replayIntegration()` directly. The split-package API is the deprecated pre-v8 shape; one dependency instead of three (AC-4, AC-5).

- **DD-3 — `import.meta.env` read directly in `sentry.ts` vs. a dedicated config/env-schema module:** read `import.meta.env.VITE_SENTRY_*` inline in `initSentry()`. Five flat values used in exactly one file don't justify a schema/validation layer (P2, code-style rule 3 — no abstraction without 3+ reuse sites).

- **DD-4 — Level filtering via `beforeSend` comparison array vs. a third-party log-level library:** implement `meetsLevelThreshold` as one small ordered-array lookup. Sentry has no built-in "minimum level" option, and the five-value fixed set (AC-6) doesn't warrant pulling in a level library for one comparison.

- **DD-5 — Relying on Sentry's built-in empty-DSN no-op vs. an explicit `if (dsn)` guard before calling `init()`:** rely on the SDK's documented behavior. Adding a guard would be dead code duplicating what `Sentry.init` already does when `dsn` is falsy (AC-2).
