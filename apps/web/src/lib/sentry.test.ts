import { describe, it, expect } from 'vitest';
import { initSentry, meetsLevelThreshold, type SentryLevel } from './sentry';

describe('meetsLevelThreshold', () => {
  it.each([
    ['debug', false],
    ['info', false],
    ['warning', true],
    ['error', true],
    ['fatal', true],
  ] satisfies [SentryLevel, boolean][])('%s vs "warning" threshold -> %s', (level, expected) => {
    expect(meetsLevelThreshold(level, 'warning')).toBe(expected);
  });
});

describe('initSentry', () => {
  it('does not throw when VITE_SENTRY_DSN is unset', () => {
    expect(() => initSentry()).not.toThrow();
  });
});
