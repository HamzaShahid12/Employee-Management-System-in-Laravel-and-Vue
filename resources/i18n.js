import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ur from './locales/ur.json';

const i18n = createI18n({
  locale: 'en', // set default locale
  fallbackLocale: 'en',
  messages: {
    en,
    ur
  }
});

export default i18n;
