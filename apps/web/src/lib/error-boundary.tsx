import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Minimal, dependency-free error boundary. Kept out of `@sentry/react` so the
 * SDK (and its tracing/replay integrations) can be code-split and deferred
 * instead of sitting on the initial bundle's critical path.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // ponytail: if the idle-callback-deferred Sentry import hasn't resolved yet,
    // this capture is dropped rather than queued/buffered. Acceptable for a
    // personal portfolio site; add a buffer if this ever needs to catch
    // errors thrown in the first few hundred ms after load.
    void import('@sentry/react').then((Sentry) => {
      Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="app-shell">
          <div>
            <h1>Something went wrong</h1>
            <p>Please try navigating elsewhere.</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
