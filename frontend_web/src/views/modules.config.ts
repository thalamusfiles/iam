import { IconsDef } from '../commons/consts';

const modulesConfig = {
  routes: [
    //TODO definir interface para definição de rotas
    { title: 'menu.modules.mgt', link: '/mgt', icon: IconsDef.management, color: 'gray' },
    { title: 'menu.modules.bi', link: '/bi', icon: IconsDef.reports, color: 'green' },
  ],
};

export default modulesConfig;
