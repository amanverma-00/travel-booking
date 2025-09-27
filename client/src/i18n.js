import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Backend configuration for lazy loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Namespace configuration
    ns: ['common'],
    defaultNS: 'common',
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false,
    },
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      excludeCacheFor: ['cimode'],
    },
    
    // Load resources synchronously
    initImmediate: false,
    
    // React configuration
    react: {
      useSuspense: true,
    },
    
    // Supported languages
    supportedLngs: ['en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu', 'es'],
    
    // Preload languages
    preload: ['en'],
  });

export default i18n;