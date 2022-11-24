import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IconsDef } from '../../commons/consts';
import { RouteDefinition, RouteDefinitions } from '../../commons/route';
import Home from './home';
import { PersonEdit, PersonList } from './person';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RouteDefinitions = {
  // Home
  home: { title: 'menu.home', path: '*/home', component: Home },
  // Person
  person_list: { title: 'person.list.title', icon: IconsDef.person, path: '*/person/list', component: PersonList },
  person_edit: { title: 'person.edit.title', path: '*/person/edit/:id(\\d+)*', component: PersonEdit },
  person_new: { title: 'person.new.title', path: '*/person/new', component: PersonEdit },
  // Roles
  roles_list: { title: 'roles.list.title', icon: IconsDef.roles, path: '*/roles/list', component: PersonList },
  roles_edit: { title: 'roles.edit.title', path: '*/roles/edit/:id(\\d+)*', component: PersonEdit },
  roles_new: { title: 'roles.new.title', path: '*/roles/new/:owner/:ownerId', component: PersonEdit },
  // Permissions
  permissions_list: { title: 'permissions.list.title', icon: IconsDef.permissions, path: '*/permissions/list', component: PersonList },
  permissions_edit: { title: 'permissions.edit.title', path: '*/permissions/edit/:id(\\d+)*', component: PersonEdit },
  permissions_new: { title: 'permissions.new.title', path: '*/permissions/new', component: PersonEdit },
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
    <Switch>
      {Object.values(routes).map((route, idx) => (
        <Route exact path={route.path.replace('*/', '/mgt/').concat('*')} component={route.component} key={idx} />
      ))}

      <Redirect to="/mgt/home" />
    </Switch>
  );
}

/**
 * Criar rotas para serem exibidas em modal.
 * @param props
 */
export function MgtModalRoutes(props: any) {
  return (
    <Switch>
      {Object.values(routes).map((route, idx) => (
        <Route
          exact
          path={route.path.replace('*/', '*/modal/')}
          component={(props: any) => <route.component inModal={true} {...props} />}
          key={idx}
        />
      ))}
    </Switch>
  );
}
