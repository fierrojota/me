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
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.2),
    replaysSessionSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0.1),
    replaysOnErrorSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1.0),
    beforeSend(event) {
      const level = (event.level as SentryLevel | undefined) ?? 'error';
      return meetsLevelThreshold(level, levelThreshold) ? event : null;
    },
  });
}
