import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enHome from '../locales/en/home.json';
import esHome from '../locales/es/home.json';

export const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'home',
  resources: {
    en: { home: enHome },
    es: { home: esHome },
  },
  interpolation: { escapeValue: false },
});
