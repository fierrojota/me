# Review Findings — 02-observability
Date: 2026-07-24

## Critical (must fix before approval)

(none)

## Major (should fix)

- `.specs/02-observability/review-guide.md:11`, `.specs/02-observability/review/web.md:11` — a real configuration value was embedded in two spec docs, contradicting `docs/OBSERVABILITY.md`'s own instruction ("DSN lives in `apps/web/.env` (gitignored)... never commit the real value") and AC-3's intent that only `.env.example` (empty) is committed. **Fixed:** both files now point at `apps/web/.env` instead of carrying the value.

## Minor (optional)

- `docs/OBSERVABILITY.md:16` — "Where things live" said `apps/web/src/main.tsx — wraps <App /> in Sentry.ErrorBoundary`, stale vs. the revised DD-1. **Fixed:** now says the hand-rolled `ErrorBoundary` (`apps/web/src/lib/error-boundary.tsx`).
- `docs/OBSERVABILITY.md:15` — said `initSentry()` runs "before the app renders", stale post-fix. **Fixed:** now describes the deferred dynamic-import/idle-callback load.
- `.specs/02-observability/tasks.json` (ui-1 `files`) — was missing `error-boundary.tsx`/`error-boundary.test.tsx` added by the DD-1 fix. **Fixed:** both files added to `ui-1.files`.

## Verdict
approved (all findings resolved)
