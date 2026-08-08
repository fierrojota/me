import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enHome from '../locales/en/home.json';
import esHome from '../locales/es/home.json';

// Keep <html lang> in sync with the active language. index.html ships lang="en"
// as the initial value, but without this the document keeps announcing itself as
// English after switching to ES — a screen reader would read Spanish copy with
// English pronunciation (WCAG 3.1.1 / 3.1.2).
i18n.on('languageChanged', () => {
  const lng = i18n.resolvedLanguage;
  if (lng) document.documentElement.lang = lng;
});

// Translations are bundled, not fetched. i18next-http-backend used to load them
// over HTTP, which put a third serial hop on the critical path: HTML -> JS ->
// parse -> fetch JSON -> only then first paint. `useTranslation` suspended and
// App's fallback was `null`, so the page stayed blank for the whole round trip.
// It was worse for Spanish speakers: with fallbackLng 'en', detecting `es`
// fetched *both* languages — four blocking requests before a single pixel.
//
// Both languages together are 2,550 B gzipped, +2.7% on the JS bundle. Paying
// that once to delete the entire hop, for every visitor rather than only
// English ones, is the trade. init() is now synchronous: nothing suspends.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { home: enHome },
      es: { home: esHome },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    defaultNS: 'home',
    ns: ['home'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
