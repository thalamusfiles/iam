import { IconsDef } from '../commons/consts';
import { EndpointsDef } from '../datasources/endpoints';

const modulesConfig = {
  routes: [
    //TODO definir interface para definição de rotas
    { title: 'menu.modules.mgt', link: EndpointsDef.managementUrl, icon: IconsDef.management, color: 'gray' },
    { title: 'menu.modules.bi', link: EndpointsDef.biUrl, icon: IconsDef.reports, color: 'green' },
  ],
};

export default modulesConfig;
