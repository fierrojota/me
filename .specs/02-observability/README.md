# Observability

**Slug:** 02-observability
**Branch:** feature/02-observability
**PR:** (see below)
**Merged:** 2026-07-24

## Summary

Integrated `@sentry/react` for error tracking, performance tracing, and session replay in `apps/web`, reporting to a GlitchTip cloud project. Found and fixed a CONSTITUTION P1 (performance-first) violation mid-flow: the original eager SDK init regressed the main bundle +89.34 kB gzip (+149%); resolved by swapping to a dependency-free error boundary and deferring `initSentry()` behind a code-split dynamic import, bringing the net regression down to +1.16 kB gzip.

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | React ErrorBoundary error capture | ✓ |
| AC-2 | SDK initialized with no-op fallback | ✓ |
| AC-3 | GlitchTip cloud DSN configured | ✓ |
| AC-4 | Performance tracing | ✓ |
| AC-5 | Session replay | ✓ |
| AC-6 | Configurable reporting level | ✓ |
| AC-7 | Observability documentation | ✓ |

## Files Added / Modified

| File | Change |
|------|--------|
| `apps/web/src/lib/sentry.ts` | New — `initSentry()`, `meetsLevelThreshold()`, `parseSampleRate()` |
| `apps/web/src/lib/error-boundary.tsx` | New — dependency-free error boundary (post-review fix, replaced `Sentry.ErrorBoundary`) |
| `apps/web/src/main.tsx` | Edit — wraps `<App />` in `ErrorBoundary`; defers `initSentry()` via `requestIdleCallback`/dynamic import |
| `apps/web/.env.example` | New — 5 `VITE_SENTRY_*` env vars documented |
| `docs/OBSERVABILITY.md` | New — setup, env vars, ad-blocker gotcha, links |
| `apps/web/README.md` | Edit — Observability section added |

## Patterns Introduced

- **Deferred SDK loading**: heavy client SDKs (analytics, error tracking) should be code-split via dynamic `import()` behind an idle trigger (`requestIdleCallback`/`setTimeout` fallback), never a static top-level import, to keep them off the initial-render critical path.
- **Dependency-free error boundary**: a plain `class extends Component` boundary that dynamically imports the reporting SDK only inside `componentDidCatch`, decoupling "can catch an error" from "SDK is loaded".
- **Spec docs must not carry real secrets**: manual-testing docs (`review-guide.md`, `review/*.md`) should reference `.env` rather than embed real DSN/token values, even for low-severity client-side DSNs.

## Test Coverage

- Unit: `pnpm --filter @me/web test`
- E2E (Playwright): `pnpm --filter @me/e2e test`
- Visual smoke: `pnpm --filter @me/ui build-storybook`
