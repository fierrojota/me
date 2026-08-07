import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Keep <html lang> in sync with the active language. index.html ships lang="en"
// as the initial value, but without this the document keeps announcing itself as
// English after switching to ES — a screen reader would read Spanish copy with
// English pronunciation (WCAG 3.1.1 / 3.1.2).
i18n.on('languageChanged', () => {
  const lng = i18n.resolvedLanguage;
  if (lng) document.documentElement.lang = lng;
});

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    defaultNS: 'common',
    ns: ['common', 'home'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
