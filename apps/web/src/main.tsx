import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import '@me/ui'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './lib/error-boundary'
import './lib/i18n'

// ponytail: defer Sentry off the initial render path — load it once the browser
// is idle instead of blocking first paint, and only when a DSN is configured.
// Without the guard the SDK still downloads and parses ~150 kB to then no-op,
// which is exactly what every DSN-less build (previews, local, CI) was doing.
if (import.meta.env.VITE_SENTRY_DSN) {
  const loadSentry = () => void import('./lib/sentry').then((m) => m.initSentry());
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadSentry);
  } else {
    setTimeout(loadSentry, 0);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      {/* Vercel Web Analytics. Not the `/next` entrypoint the dashboard shows —
          this is a Vite SPA. Kept inside the boundary on purpose: the component
          only appends a deferred <script> from /_vercel/insights, but if it ever
          did throw, an uncaught error at the root unmounts the entire tree,
          whereas here the existing fallback contains it.
          Same-origin script + beacon, so the strict CSP in vercel.json needs no
          exception: `script-src 'self'` and `connect-src 'self'` already cover it. */}
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
)
