//Todo:Mudar nome do arquivo para component.plugin.ts
import React from 'react';
import { WmsFormProps } from '../components/Form';
import { notify } from '../components/Notification';

/**
 * Nomes dos formulários do sistema que são customizáveis
 */
export enum TargetForm {
  //management
  user_edit,
  user_list,
  role_edit,
  role_list,
  permission_edit,
  permission_list,
  application_edit,
  application_list,
}

/**
 * Propriedades do componente dinâmico
 */
export interface PagePluginProps {
  name: string;
  sidebarTitle?: string;
  target: TargetForm;
  order: number;
  displayInModal?: boolean;
  //utilização interna
  component?: React.FC;
}

export function addPagePlugin(props: PagePluginProps) {
  //Inicializa estrutura do componente
  if (!components[props.target]) {
    components[props.target] = {
      components: [],
    };
  }
  components[props.target].components.push(props);
}

const components: {
  [key: string]: {
    components: PagePluginProps[];
  };
} = {};

/**
 * Busca todos os componentes adicionados na tela
 * @param target
 */
export function findComponents(target: TargetForm | null): PagePluginProps[] {
  if (target === null) {
    return Object.values(components).reduce((last, curr) => last.concat(curr.components), [] as PagePluginProps[]);
  }
  if (components[target]) return components[target].components || [];

  notify.info(`WmsFormComponent "${target}" without components.`);
  return [];
}

/**
 * Classe base para formulários useralizáveis
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
    component: React.ComponentClass<WmsFormProps>;
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
  return <T extends React.ComponentClass<WmsFormProps>>(target: T): T => {
    //Inicializa estrutura do componente
    if (!wmsFormPlugins[props.name]) {
      wmsFormPlugins[props.name] = {
        component: target,
      };
    }
    return target;
  };
}
