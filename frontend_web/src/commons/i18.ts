import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { registerLocale } from 'react-datepicker';
import { initReactI18next } from 'react-i18next';
import env from '../.env';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'pt-BR',
    debug: env.i18nLog,
    interpolation: {
      escapeValue: false,
    },
  });

registerLocale('pt-BR', ptBR);
registerLocale('en-US', enUS);

//Função de tradução
const __ = (a: any, options?: any) => i18next.t(a, options);

export const useI18N = () => __;

export const currentLocale = () => i18next.language;
