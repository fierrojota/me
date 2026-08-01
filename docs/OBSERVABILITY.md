# Observability — me

Error tracking, performance tracing, and session replay for `apps/web` via `@sentry/react`, reporting to a GlitchTip instance (a drop-in Sentry-protocol ingest endpoint).

## Run

```bash
cp apps/web/.env.example apps/web/.env
# fill in VITE_SENTRY_DSN with the real GlitchTip DSN, then:
pnpm --filter @me/web dev
```

## Where things live

- `apps/web/src/lib/sentry.ts` — `initSentry()`, dynamically imported and called from `main.tsx` once the browser is idle (after initial render), not on the critical path
- `apps/web/src/main.tsx` — wraps `<App />` in the hand-rolled `ErrorBoundary` (`apps/web/src/lib/error-boundary.tsx`)
- GlitchTip project (dev): [`app.glitchtip.com/26058`](https://app.glitchtip.com/26058)
- DSN lives in `apps/web/.env` (gitignored) — copy from `apps/web/.env.example`, never commit the real value

## Env vars

| Var | Default | Controls |
|---|---|---|
| `VITE_SENTRY_DSN` | *(empty)* | Ingest endpoint. Empty = SDK no-op (nothing sent). |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | `0.2` | Fraction of page loads/navigations traced as performance transactions. |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | `0.1` | Fraction of normal sessions recorded as session replay. |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | `1.0` | Fraction of sessions recorded when an error occurs. |
| `VITE_SENTRY_LEVEL` | `warning` | Minimum event level sent (`debug` < `info` < `warning` < `error` < `fatal`); lower levels are dropped. |

## Ad-blocker gotcha

Browser ad-blockers (uBlock Origin, Brave Shields, etc.) commonly block requests matching `*/envelope/*` or `*sentry*` URL patterns with `net::ERR_BLOCKED_BY_CLIENT`. This is a local dev-browser artifact, not an app bug. To verify ingest locally, test in an Incognito/private window with extensions disabled, or allowlist `app.glitchtip.com`.

## Links

- [Sentry React SDK docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [GlitchTip docs](https://glitchtip.com/documentation)
