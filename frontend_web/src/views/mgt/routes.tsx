import { Route, Routes } from 'react-router-dom';
import { IconsDef } from '../../commons/consts';
import { RouteDefinition, RouteDefinitions } from '../../commons/route';
import DevicesConnectedPage from '../account/devices';
import LoginsPage from '../account/logins';
import { ApplicationEdit, ApplicationList } from './application';
import Home from './home';
import { PermissionEdit, PermissionList } from './permission';
import { PersonEdit, PersonList } from './person';
import { RegionEdit, RegionList } from './region';
import { RoleEdit, RoleList } from './roles';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RouteDefinitions = {
  // Home
  home: { title: 'menu.home', path: '*/home', component: Home, index: true },
  //
  devices_connected: { title: '', path: '*/devices/connected', component: DevicesConnectedPage },
  logins_history: { title: '', path: '*/logins/history', component: LoginsPage },
  //// Person
  person_list: { title: 'person.list.title', icon: IconsDef.person, path: '*/person/list', component: PersonList },
  person_edit: { title: 'person.edit.title', icon: IconsDef.person, path: '*/person/edit/:id(\\d+)', component: PersonEdit },
  person_new: { title: 'person.new.title', icon: IconsDef.person, path: '*/person/new', component: PersonEdit },
  // Role
  role_list: { title: 'roles.list.title', icon: IconsDef.roles, path: '*/role/list', component: RoleList },
  role_edit: { title: 'roles.edit.title', path: '*/role/edit/:id(\\d+)*', component: RoleEdit },
  role_new: { title: 'roles.new.title', path: '*/role/new', component: RoleEdit },
  // Permissions
  permission_list: { title: 'permissions.list.title', icon: IconsDef.permissions, path: '*/permission/list', component: PermissionList },
  permission_edit: { title: 'permissions.edit.title', path: '*/permission/edit/:id(\\d+)*', component: PermissionEdit },
  permission_new: { title: 'permissions.new.title', path: '*/permission/new', component: PermissionEdit },
  // Region
  region_list: { title: 'regions.list.title', icon: IconsDef.region, path: '*/region/list', component: RegionList },
  region_edit: { title: 'regions.edit.title', path: '*/region/edit/:id(\\d+)*', component: RegionEdit },
  region_new: { title: 'regions.new.title', path: '*/region/new', component: RegionEdit },
  // Application
  application_list: { title: 'applications.list.title', icon: IconsDef.applications, path: '*/application/list', component: ApplicationList },
  application_edit: { title: 'applications.edit.title', path: '*/application/edit/:id(\\d+)*', component: ApplicationEdit },
  application_new: { title: 'applications.new.title', path: '*/application/new', component: ApplicationEdit },
};

/**
 * Localiza a rota pelo pathname e nome da rota
 * @param location react-route.location
 */
export const findRouteByLocation = (location: any, parentMatch: any): RouteDefinition | null => {
  const pathId = location.pathname.replace(parentMatch.path + '/', '').replace(/\//g, '_');

  return routes[pathId];
};

/**
 * Rotas
 */
export default function MgtRoutes() {
  //Não é porcorrida as ou realizado um foreach por questão de desempenho
  return (
    <Routes>
      {Object.values(routes).map((route, idx) => (
        <Route index={route.index} path={route.path.replace('*/', '/').concat('/*')} element={<route.component />} key={idx} />
      ))}
    </Routes>
  );
}

/**
 * Criar rotas para serem exibidas em modal.
 * @param props
 */
export function MgtModalRoutes(props: any) {
  return (
    <Routes>
      {Object.values(routes).map((route, idx) => (
        <Route path={route.path.replace('*/', '/')} element={<route.component inModal={true} {...props} />} key={idx} />
      ))}
    </Routes>
  );
}
