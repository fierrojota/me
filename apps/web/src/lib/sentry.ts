import * as Sentry from '@sentry/react';
import { version } from '../../package.json';

const LEVELS = ['debug', 'info', 'warning', 'error', 'fatal'] as const;

export type SentryLevel = (typeof LEVELS)[number];

export function meetsLevelThreshold(level: SentryLevel, threshold: SentryLevel): boolean {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(threshold);
}

function parseSampleRate(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function initSentry(): void {
  const levelThreshold = (import.meta.env.VITE_SENTRY_LEVEL as SentryLevel | undefined) ?? 'warning';

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: version,
    // Session Replay was dropped (2026-08-07): rrweb cost 39.3 kB gzip — a third
    // of the whole app — to record a one-page portfolio, and its DOM-wide
    // MutationObserver fed on the nav indicator's per-scroll inline style writes.
    // Tracing stays: Web Vitals are the point of P1.
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.2),
    beforeSend(event) {
      const level = (event.level as SentryLevel | undefined) ?? 'error';
      return meetsLevelThreshold(level, levelThreshold) ? event : null;
    },
  });
}
