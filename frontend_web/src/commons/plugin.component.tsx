//Todo:Mudar nome do arquivo para component.plugin.ts
import React from 'react';
import { WmsFormProps } from '../components/Form';
import { notify } from '../components/Notification';
import { CommonEditStore } from '../views/generic/edit/ctrl';
import { IReactClassComponent } from './types/IReactComponent';

/**
 * Nomes dos formulários do sistema que são customizáveis
 */
export enum TargetForm {
  //management
  person_edit,
  person_list,
}

/**
 * Propriedades do componente dinâmico
 */
export interface WMSPagePluginProps {
  name: string;
  sidebarTitle?: string;
  target: TargetForm;
  order: number;
  displayInModal?: boolean;
  //utilização interna
  component?: IReactClassComponent;
}

/**
 * Anotação responsável em criar novos componentes para ser adicionados na telas do sistema.
 * @param props
 */
export function WMSPagePlugin(props: WMSPagePluginProps) {
  return <T extends IReactClassComponent>(target: T): T => {
    //Inicializa estrutura do componente
    if (!components[props.target]) {
      components[props.target] = {
        components: [],
      };
    }
    //Adiciona novo componente
    props.component = target;
    components[props.target].components.push(props);
    return target;
  };
}

/**
 * Interface com os métodos obrigatórios
 * a serem implementados pelo componente dinâmico
 */
export interface CustomComponentI extends React.Component<{ ctrl: CommonEditStore; __?: Function }> {
  /**
   * Método disparado após o conteudo ser carregado
   */
  onLoadContent?: () => void;
  /**
   * Método disparado quando o conteudo é modificado
   */
  onAssignContent?: (assignValues: any) => void;
}

export abstract class CustomComponentA<State = {}, CTRL = CommonEditStore> extends React.Component<{ ctrl: CTRL; __?: Function }, State> {}

const components: {
  [key: string]: {
    components: WMSPagePluginProps[];
  };
} = {};

/**
 * Busca todos os componentes adicionados na tela
 * @param target
 */
export function findComponents(target: TargetForm | null): WMSPagePluginProps[] {
  if (target === null) {
    return Object.values(components).reduce((last, curr) => last.concat(curr.components), [] as WMSPagePluginProps[]);
  }
  if (components[target]) return components[target].components || [];

  notify.info(`WmsFormComponent "${target}" without components.`);
  return [];
}

/**
 * Classe base para formulários personalizáveis
 * @type WmsFormProps define as propriedades que o componente deve aceitar.
 */
export abstract class WmsFormComponent extends React.Component<WmsFormProps> {}

/**
 * Propriedades do form dinâmico
 */
export interface WMSFormPluginProps {
  name: string;
}

const wmsFormPlugins: {
  [key: string]: {
    component: IReactClassComponent<WmsFormProps>;
  };
} = {};

/**
 * Busca os componentes anotados com WmsFormPlugin
 * @type customizableWmsForm
 */
export function findWmsFormPlugin(name: string, props: WmsFormProps): JSX.Element | null {
  const formPlugn = wmsFormPlugins[name];
  if (formPlugn) {
    return <formPlugn.component {...props} />;
  }
  notify.info(`WmsFormPlugin "${name}" not found.`);
  return null;
}

/**
 * Class decorator utilizado para customizar formulários.
 * @param props define as propriedades que o componente deve aceitar.
 */
export function WmsFormPlugin(props: WMSFormPluginProps) {
  return <T extends IReactClassComponent<WmsFormProps>>(target: T): T => {
    //Inicializa estrutura do componente
    if (!wmsFormPlugins[props.name]) {
      wmsFormPlugins[props.name] = {
        component: target,
      };
    }
    return target;
  };
}
