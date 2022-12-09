

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteDefinitions } from '../../commons/route';
import DevicesConnectedPage from '../account/devices';
import HomeAccount from '../account/home';
import LoginsPage from '../account/logins';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RouteDefinitions = {
  // Home
  home: { title: 'menu.home', path: '*/home', component: HomeAccount },
  //
  devices_connected: { title: '', path: '*/devices/connected', component: DevicesConnectedPage },
  logins_history: { title: '', path: '*/logins/history', component: LoginsPage },
};

/**
 * Rotas
 */
export default function AccountRoutesRoutes() {
  //Não é porcorrida as ou realizado um foreach por questão de desempenho
  return (
    <Switch>
      {Object.values(routes).map((route, idx) => (
        <Route exact path={route.path.replace('*/', '/account/').concat('*')} component={route.component} key={idx} />
      ))}

      <Redirect to="/account/home" />
    </Switch>
  );
}
