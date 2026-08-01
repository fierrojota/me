# Manual Testing — 02-observability Web

Browser smoke tests. Run against local dev stack.

## Setup

```bash
pnpm --filter @me/web dev     # :3001
```

Ensure `apps/web/.env` has `VITE_SENTRY_DSN` set to the real GlitchTip DSN (gitignored, never committed — see the GlitchTip project settings) for tests that need real ingest (AC-2, AC-3, AC-4, AC-5). Leave it empty for the no-op check (AC-2).

---

## 1. SDK initializes / no-op fallback (AC-2)

1. With `VITE_SENTRY_DSN` empty, open http://localhost:3001
2. Open DevTools Console
3. Expected: no errors thrown, no requests to `app.glitchtip.com` in the Network tab
4. Set `VITE_SENTRY_DSN` to the real DSN, restart dev server, reload
5. Expected: `release` and `environment` tags visible if `Sentry.getClient()?.getOptions()` is inspected via console (optional), no console errors

---

## 2. GlitchTip DSN ingest (AC-3)

1. With real DSN set, open http://localhost:3001
2. Trigger a manual error from DevTools console: `throw new Error('manual test')` inside a component context, or use the ErrorBoundary trigger below
3. Expected: request fires to `app.glitchtip.com/api/26058/...` (Network tab), 200 response
4. Confirm the event appears in the GlitchTip project dashboard within ~1 min

---

## 3. React ErrorBoundary fallback (AC-1)

1. Temporarily add a component that throws during render (or use an existing dev-only trigger)
2. Open http://localhost:3001, navigate to the throwing route/component
3. Expected: fallback UI renders ("Something went wrong" or similar) — no blank white screen
4. Navigate to a different route/page
5. Expected: app recovers normal state, no stuck error UI
6. Confirm the error appears in GlitchTip with component stack attached

---

## 4. Performance tracing (AC-4)

1. Open http://localhost:3001 with real DSN set
2. Reload the page, then navigate to another in-app route
3. Expected: Network tab shows transaction/envelope requests to GlitchTip on load and on navigation
4. Confirm a "pageload" and a "navigation" transaction appear in the GlitchTip Performance tab

---

## 5. Session replay + PII masking (AC-5)

1. Open http://localhost:3001 with real DSN set, interact with the page for a few seconds (click, scroll, type in any input)
2. Expected: a replay session request fires to GlitchTip
3. Confirm the replay appears in the GlitchTip dashboard
4. Play back the replay: all text should appear masked, all media blocked — no readable PII

---

## 6. Configurable reporting level (AC-6)

1. Set `VITE_SENTRY_LEVEL=error` in `apps/web/.env`, restart dev server
2. Trigger a `console.warn`-level or `captureMessage('test', 'warning')` event (via DevTools console using the SDK if exposed, or a dev trigger)
3. Expected: warning-level event is NOT sent (no GlitchTip request)
4. Trigger an actual thrown error
5. Expected: error-level event IS sent
6. Revert `VITE_SENTRY_LEVEL` to `warning` (or remove) after testing

---

## Checklist

| AC | Scenario | Pass |
|----|----------|------|
| AC-1 | ErrorBoundary shows fallback, no white screen, recovers on nav | [x] |
| AC-2 | Empty DSN = no-op, real DSN = SDK initializes with tags | [x] |
| AC-3 | GlitchTip ingests events at the configured DSN | [x] |
| AC-4 | Pageload + navigation transactions captured | [x] |
| AC-5 | Session replay captured with PII masked | [x] |
| AC-6 | Only events at/above VITE_SENTRY_LEVEL are sent | [x] |
