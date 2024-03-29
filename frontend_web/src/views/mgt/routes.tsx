import { Navigate, Route, Routes } from 'react-router-dom';
import { IconsDef } from '../../commons/consts';
import { RouteDefinition, RouteDefinitions } from '../../commons/route';
import { InModal } from '../../components/Modal';
import DevicesConnectedPage from '../account/devices';
import LoginsPage from '../account/logins';
import { ApplicationEdit, ApplicationList } from './application';
import ChangeApplication from './context/changeapplication';
import Home from './home';
import { PermissionEdit, PermissionList } from './permission';
import { RoleEdit, RoleList } from './roles';
import { UserEdit, UserList } from './user';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RouteDefinitions = {
  // Home
  home: { title: 'menu.home', path: '/home', component: Home, index: true },
  context_change_application: { title: 'menu.home', path: '/context/change_application', component: ChangeApplication, index: true },
  //
  devices_connected: { title: '', path: '/devices/connected', component: DevicesConnectedPage },
  logins_history: { title: '', path: '/logins/history', component: LoginsPage },
  //// User
  user_list: { title: 'user.list.title', icon: IconsDef.user, path: '/user/list', component: UserList },
  user_edit: { title: 'user.edit.title', icon: IconsDef.user, path: '/user/edit/:uuid', component: UserEdit },
  user_new: { title: 'user.new.title', icon: IconsDef.user, path: '/user/new', component: UserEdit },
  // Role
  role_list: { title: 'roles.list.title', icon: IconsDef.roles, path: '/role/list', component: RoleList },
  role_edit: { title: 'roles.edit.title', path: '/role/edit/:uuid', component: RoleEdit },
  role_new: { title: 'roles.new.title', path: '/role/new', component: RoleEdit },
  // Permissions
  permission_list: { title: 'permissions.list.title', icon: IconsDef.permissions, path: '/permission/list', component: PermissionList },
  permission_edit: { title: 'permissions.edit.title', path: '/permission/edit/:uuid', component: PermissionEdit },
  permission_new: { title: 'permissions.new.title', path: '/permission/new', component: PermissionEdit },
  // Application
  application_list: { title: 'applications.list.title', icon: IconsDef.applications, path: '/application/list', component: ApplicationList },
  application_edit: { title: 'applications.edit.title', path: '/application/edit/:uuid', component: ApplicationEdit },
  application_new: { title: 'applications.new.title', path: '/application/new', component: ApplicationEdit },
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
  return (
    <Routes>
      {Object.values(routes).map((route, idx) => (
        <Route index={route.index} path={route.path.concat('/*')} element={<route.component />} key={idx} />
      ))}
      <Route path="/" element={<Navigate to={'/mgt/home'} replace />} />
    </Routes>
  );
}

/**
 * Criar rotas para serem exibidas em modal.
 * @param props
 */
export function MgtModalRoutes(props: any) {
  //Component modal com as rotas
  const modalComponent = (
    <InModal>
      <Routes>
        {Object.values(routes).map((route, idx) => (
          <Route path={route.path.concat('/*')} element={<route.component inModal={true} {...props} />} key={idx} />
        ))}
      </Routes>
    </InModal>
  );
  // Adiciona prepende para abertura do modal
  return (
    <Routes>
      <Route path={':ignore1/modal/*'} element={modalComponent} />
      <Route path={':ignore1/:ignore2/modal/*'} element={modalComponent} />
    </Routes>
  );
}
