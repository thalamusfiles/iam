import { Navigate, Route, Routes } from 'react-router-dom';
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
  home: { title: 'menu.home', path: '/home', component: HomeAccount },
  //
  devices_connected: { title: '', path: '/devices/connected', component: DevicesConnectedPage },
  logins_history: { title: '', path: '/logins/history', component: LoginsPage },
};

/**
 * Rotas
 */
export default function AccountRoutesRoutes() {
  //Não é porcorrida as ou realizado um foreach por questão de desempenho
  return (
    <Routes>
      {Object.values(routes).map((route, idx) => (
        <Route path={route.path.concat('/*')} element={<route.component />} key={idx} />
      ))}
      <Route path="/" element={<Navigate to={'/account/home'} replace />} />
    </Routes>
  );
}
