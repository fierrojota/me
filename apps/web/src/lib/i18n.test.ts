import { describe, it, expect } from 'vitest';
import { createInstance } from 'i18next';
import en from '../../public/locales/en/common.json';
import es from '../../public/locales/es/common.json';

describe('locale files', () => {
  it('en and es common.json expose the same keys', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });
});

describe('fallback behavior', () => {
  it('falls back to en when a key is missing from the active language, never returning the raw key', async () => {
    const instance = createInstance();
    await instance.init({
      lng: 'es',
      fallbackLng: 'en',
      resources: {
        en: { common: { greeting: 'Hello' } },
        es: { common: {} },
      },
    });

    expect(instance.t('common:greeting')).toBe('Hello');
    expect(instance.t('common:greeting')).not.toBe('greeting');
  });
});
