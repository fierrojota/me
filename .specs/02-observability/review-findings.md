# Review Findings — 02-observability
Date: 2026-07-24

## Critical (must fix before approval)

(none)

## Major (should fix)

- `.specs/02-observability/review-guide.md:11`, `.specs/02-observability/review/web.md:11` — the real GlitchTip DSN (redacted here; was committed in plaintext) was present in two spec docs, contradicting `docs/OBSERVABILITY.md`'s own instruction ("DSN lives in `apps/web/.env` (gitignored)... never commit the real value") and AC-3's intent that only `.env.example` (empty) is committed. A leaked DSN lets anyone spam events into the GlitchTip project (quota exhaustion / noise), so it shouldn't sit in git history even though it isn't a read-secret. **Fixed:** replaced the real DSN in both files with a reference to `apps/web/.env` instead. Note: the DSN remains in earlier git history on this branch (commit `87e18fa`) — rotate it in the GlitchTip project dashboard if that's a concern, since editing history isn't done here without explicit request.

## Minor (optional)

- `docs/OBSERVABILITY.md:16` — "Where things live" said `apps/web/src/main.tsx — wraps <App /> in Sentry.ErrorBoundary`, stale vs. the revised DD-1. **Fixed:** now says the hand-rolled `ErrorBoundary` (`apps/web/src/lib/error-boundary.tsx`).
- `docs/OBSERVABILITY.md:15` — said `initSentry()` runs "before the app renders", stale post-fix. **Fixed:** now describes the deferred dynamic-import/idle-callback load.
- `.specs/02-observability/tasks.json` (ui-1 `files`) — was missing `error-boundary.tsx`/`error-boundary.test.tsx` added by the DD-1 fix. **Fixed:** both files added to `ui-1.files`.

## Verdict
approved (all findings resolved)
