import { IconName } from '@fortawesome/fontawesome-svg-core';
import type { Router as RemixRouter } from '@remix-run/router';
import qs from 'qs';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { EndpointsDef } from '../datasources/endpoints';
import { RoutesName } from '../views/routes-name';
import { localStorageDef } from './consts';
import Storage from './storage';

export type RouteDefinition = { title: string; icon?: IconName | Array<IconName>; path: string; component: any; index?: boolean };
export type RouteDefinitions = { [key: string]: RouteDefinition };

let router: RemixRouter;
export const createBaseRouter = (routes: RouteObject[]): RemixRouter => (router = createBrowserRouter(routes));

export function historyPush(
  owner: RoutesName | string | number,
  options: { id?: any; inModal?: boolean; showSave?: boolean; open?: boolean; absolute?: boolean; search?: boolean } & any = {},
) {
  // Quando informado número, volta pra páginas anteriores ou posteriores.
  if (typeof owner === 'number') router.navigate(owner);

  let push;
  switch (owner as RoutesName) {
    // PUBLIC
    case 'login':
      push = '/public/:region/:app/login'.replace(':region', options.region).replace(':app', options.app);
      break;
    case 'register':
      push = '/public/:region/:app/register'.replace(':region', options.region).replace(':app', options.app);
      break;
    // ACCOUNT
    case 'home_account':
      push = '/account/home';
      break;
    //
    case 'devices_connected':
      push = '/devices/connected';
      break;
    case 'logins_history':
      push = '/logins/history';
      break;
    // MGT
    case 'home':
      push = '/mgt/home';
      break;
    case 'person_list':
      push = '/mgt/person/list';
      break;
    case 'person_edit':
      push = '/mgt/person/edit/:id'.replace(':id', options.id);
      break;
    case 'person_new':
      push = '/mgt/person/new';
      break;
    case 'role_list':
      push = '/mgt/role/list';
      break;
    case 'role_edit':
      push = '/mgt/role/edit/:id'.replace(':id', options.id);
      break;
    case 'role_new':
      push = '/mgt/role/new';
      break;
    case 'permission_list':
      push = '/mgt/permission/list';
      break;
    case 'permission_edit':
      push = '/mgt/permission/edit/:id'.replace(':id', options.id);
      break;
    case 'permission_new':
      push = '/mgt/permission/new';
      break;
    case 'region_list':
      push = '/mgt/region/list';
      break;
    case 'region_edit':
      push = '/mgt/region/edit/:id'.replace(':id', options.id);
      break;
    case 'region_new':
      push = '/mgt/region/new';
      break;
    case 'application_list':
      push = '/mgt/application/list';
      break;
    case 'application_edit':
      push = '/mgt/application/edit/:id'.replace(':id', options.id);
      break;
    case 'application_new':
      push = '/mgt/application/new';
      break;
    default:
      push = owner as string;
      break;
  }
  if (options?.open) {
    if (options.absolute) {
      window.open(push);
    } else {
      window.open(`${EndpointsDef.url}:${EndpointsDef.port}${push}`);
    }
  } else if (options?.inModal) {
    const search = window.location.search + qs.stringify(options.search);
    let newLocation = window.location.pathname + '/modal' + push.replace(/\/mgt/, '') + '?' + search;
    if (options?.showSave) {
      newLocation = newLocation + '&show_save=show_save';
    }
    router.navigate(newLocation);
  } else {
    router.navigate(push);
  }
}

/**
 * Altera os filtros informados na URL.
 * Altera tudo que tem depois do ? na URL.
 * @param params
 * @param exclude
 */
export function historySearchReplace(params: any, exclude: string[] = []) {
  params = Object.assign({}, params, { page: undefined, count: undefined });

  exclude.forEach((x) => (params[x] = undefined));

  // TODO: Ajustar
  /*history.replace({
    search: '?' + qs.stringify(params),
  });*/
}

/**
 * Retorna os filtros informados na url
 */
export function historySearch(options: { parseArrays?: boolean } = {}) {
  return qs.parse(window.location.search.slice(1), options);
}

/**
 * Dispara uma função quando o usuário clica em historyback
 */
const hPopsCallbacks: any[] = [];
export function historyOnPop(listener: any) {
  hPopsCallbacks.push(listener);
}

/**
 * Verifica se esta autenticado e libera a rota
 * @param param0
 */
export const PrivateRoutes = ({ redirect, element }: { redirect: string; element: JSX.Element }): JSX.Element => {
  return Storage.getItem(localStorageDef.tokenKey) ? element : <Navigate to={redirect} />;
};

/**
 * Escuta as alterações de links realizadas no sistema.
 */
// TODO: Ajustar
/*
history.listen((location, action) => {
  //Verifica se tem uma hash/acontora de página e move a página até o elemento.
  if (location.hash) {
    const id = location.hash.replace('#', '');
    const element = document.getElementById(id);
    if (element) element.scrollIntoView();
  }

  //Dispara as ações ligadas ao history back;
  if (action === 'POP') {
    for (const callback of hPopsCallbacks) {
      if (typeof callback === 'function') {
        callback(location, action);
      }
    }
  }
  hPopsCallbacks.splice(0, hPopsCallbacks.length);
});
*/
