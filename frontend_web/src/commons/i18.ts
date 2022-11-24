import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import React from 'react';
import { registerLocale } from 'react-datepicker';
import { initReactI18next } from 'react-i18next';
import env from '../.env';
import { IReactComponent, IWrappedComponent } from './types/IReactComponent';

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

/**
 * Injeta i18n como propriedade da classe ou hook
 * @param stores
 */
function injectI18N(component: IReactComponent<any>): IReactComponent<any> {
  const Injector: IReactComponent<any> = React.forwardRef((props, ref) => {
    const newProps = { ...props };

    if (ref) {
      newProps.ref = ref;
    }
    newProps.__ = __;

    return React.createElement(component, newProps);
  });
  return Injector;
}

/**
 * Decorator para adicionar i18n na classe ou hook
 * @param stores
 */
export function WMSI18N(): <T extends IReactComponent<any>>(target: T) => T & (T extends IReactComponent<infer P> ? IWrappedComponent<P> : never);
export function WMSI18N() {
  return (componentClass: React.ComponentClass<any, any>) => injectI18N(componentClass);
}

export const useI18N = () => __;

export const currentLocale = () => i18next.language;
