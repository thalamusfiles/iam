import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { registerLocale } from 'react-datepicker';
import { initReactI18next, useTranslation } from 'react-i18next';
import env from '../.env';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'pt-BR',
    debug: env.I18N_LOG,
    interpolation: {
      escapeValue: false,
    },
  });

registerLocale('pt-BR', ptBR);
registerLocale('en-US', enUS);

export const useLanguage = () => i18next.language;
export const useI18N = () => useTranslation().t as (name: string, values?: any) => string;
export const currentLocale = () => i18next.language;
