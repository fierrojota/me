# Functional Spec — Observability
Date: 2026-07-22

## Purpose

Integrate Sentry (GlitchTip cloud in dev, same Sentry-protocol ingest) for error tracking, performance monitoring, and session replay in the `me` web app. Gives visibility into runtime errors and performance regressions without any user-facing changes.

## Feature users

Site owner/dev (Jonathan) — reviews errors, traces, and session replays in the GlitchTip cloud dashboard. Public visitors are unaffected — no user-facing changes.

## Trigger

Automatic — Sentry SDK captures and reports events (errors, transactions, replays) as they occur at runtime, from app load onward. No manual action required.

## Acceptance criteria

### AC-1 — React ErrorBoundary error capture

**Given** a JS error is thrown in the React component tree
**When** it propagates to the root `ErrorBoundary`
**Then:**
- Error reported to Sentry with component stack and error message
- ErrorBoundary renders a minimal fallback UI — no white screen
- Subsequent navigation recovers normal app state

### AC-2 — SDK initialized with no-op fallback

**Given** `VITE_SENTRY_DSN` env var is set (or empty)
**When** the app starts
**Then:**
- SDK initializes with the DSN, `environment` tag (`development`/`production`), and `release` tag (from `package.json` version)
- If `VITE_SENTRY_DSN` is empty or unset, SDK initializes in no-op mode — no errors thrown, no traffic sent

### AC-3 — GlitchTip cloud DSN configured

**Given** a GlitchTip cloud project (`app.glitchtip.com/26058`)
**When** `VITE_SENTRY_DSN` is set to its DSN
**Then:**
- GlitchTip accepts Sentry-protocol ingest — no SDK changes required
- `.env.example` documents the var with an empty value
- `.env` (gitignored) holds the real DSN value

### AC-4 — Performance tracing

**Given** SDK initialized
**When** a page load or navigation occurs
**Then:**
- `BrowserTracing` integration active, page load and navigation transactions captured
- Sample rate configurable via `VITE_SENTRY_TRACES_SAMPLE_RATE` env var (default `0.2`)

### AC-5 — Session replay

**Given** SDK initialized
**When** a user session is active
**Then:**
- Session replay active via the `Replay` integration
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` configurable (default `0.1`)
- `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` configurable (default `1.0` — always capture on error)
- PII masking enabled by default (`maskAllText: true`, `blockAllMedia: true`)

### AC-6 — Configurable reporting level

**Given** `VITE_SENTRY_LEVEL` env var set (values: `debug`/`info`/`warning`/`error`/`fatal`)
**When** the SDK initializes
**Then:**
- Only events at or above the configured level are sent
- Default level: `warning`
- Changing the env var and restarting is sufficient — no code changes required

### AC-7 — Observability documentation

**Given** the feature is implemented
**When** a developer needs to understand how error tracking works
**Then:**
- `docs/OBSERVABILITY.md` exists covering: GlitchTip setup, DSN configuration, sample-rate/level env vars, links to Sentry and GlitchTip official docs
- `docs/OBSERVABILITY.md` follows the same format as `docs/STORYBOOK.md` / `docs/PLAYWRIGHT.md`
- `apps/web/README.md` has an "Observability" section linking to `docs/OBSERVABILITY.md`

## Scope

**In scope:**
- Sentry SDK integration in `apps/web`
- GlitchTip cloud project configured for dev (DSN: `app.glitchtip.com/26058`)
- Root ErrorBoundary in web
- Performance tracing (page load / navigation transactions)
- Session replay with PII masking
- Configurable DSN, sample rates, and reporting level via env vars
- `docs/OBSERVABILITY.md`

**Out of scope:**
- Backend/api error tracking — no api layer in v1 (CONSTITUTION P3)
- Sentry alert rules / notification channels (Slack, email) — configured manually in dashboard
- Deep APM / database query profiling
- Self-hosted GlitchTip via docker-compose — cloud tier used instead
- Constitution amendments — no new principle added by this feature

## Dependencies

- `01-infra-base` — monorepo scaffold, env var conventions

## Edge cases

- `VITE_SENTRY_DSN` empty or missing — SDK must not throw; silently no-op
- Session replay may capture sensitive data — PII masking must be confirmed active before any production traffic

## Risks

- **PII leak via session replay** — mitigated by `maskAllText: true` + `blockAllMedia: true` defaults
- **Core Web Vitals regression (CONSTITUTION P1)** — mitigated by lazy-initializing SDK integrations where supported; LCP/CLS/INP must not regress
- **GlitchTip free-tier event limit** — mitigated by default `warning` level and `0.2`/`0.1` sample rates

## Functional scenarios (optional)

(none — single-flow feature, ACs are sufficiently atomic)
