import { describe, it, expect } from 'vitest';
import { createInstance } from 'i18next';
import en from '../locales/en/home.json';
import es from '../locales/es/home.json';

/** Flattens nested translation objects to dotted paths for key-parity checks. */
function keyPaths(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object'
      ? keyPaths(v as object, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe('locale files', () => {
  it('en and es home.json expose the same keys, nested ones included', () => {
    expect(keyPaths(es).sort()).toEqual(keyPaths(en).sort());
  });
});

describe('fallback behavior', () => {
  it('falls back to en when a key is missing from the active language, never returning the raw key', async () => {
    const instance = createInstance();
    await instance.init({
      lng: 'es',
      fallbackLng: 'en',
      defaultNS: 'home',
      resources: {
        en: { home: { greeting: 'Hello' } },
        es: { home: {} },
      },
    });

    expect(instance.t('home:greeting')).toBe('Hello');
    expect(instance.t('home:greeting')).not.toBe('greeting');
  });
});
