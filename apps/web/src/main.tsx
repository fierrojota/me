import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@me/ui'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './lib/error-boundary'
import './lib/i18n'

document.documentElement.dataset.theme = 'dark';

// ponytail: defer Sentry (tracing + replay integrations) off the initial
// render path — load it once the browser is idle instead of blocking first paint.
const loadSentry = () => void import('./lib/sentry').then((m) => m.initSentry());
if ('requestIdleCallback' in window) {
  requestIdleCallback(loadSentry);
} else {
  setTimeout(loadSentry, 0);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
