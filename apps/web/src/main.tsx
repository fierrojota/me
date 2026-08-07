import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
    </ErrorBoundary>
  </StrictMode>,
)
