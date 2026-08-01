import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../../public/locales/en/common.json';
import esCommon from '../../public/locales/es/common.json';
import enHome from '../../public/locales/en/home.json';
import esHome from '../../public/locales/es/home.json';

export const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    en: { common: enCommon, home: enHome },
    es: { common: esCommon, home: esHome },
  },
  interpolation: { escapeValue: false },
});
