# System spec — observability

> Source of truth for the current behavior of this domain.
> Auto-updated by `/j-flow-finish`. Do not edit manually outside of a finish run.
> Last updated: 2026-07-24 by feature `02-observability`

## Behaviors

### 02-observability — Sentry/GlitchTip error tracking, tracing, and session replay for apps/web (2026-07-24)

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

**Implementation note:** error reporting is deferred — `initSentry()` loads via a code-split dynamic import after the browser is idle, not synchronously at boot. An error thrown in the first few hundred ms before that import resolves is not captured (no queue/buffer); accepted trade-off for a personal portfolio site (see `docs/architecture/02-observability.md`).

<!-- next feature entries are appended above this line -->
