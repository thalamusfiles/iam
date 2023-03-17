import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './assets/fontawasome.library';
import './assets/theme.scss';
import { createBaseRouter, PrivateRoutes } from './commons/route';
import * as serviceWorker from './serviceWorker';
import UserContext from './store/userContext';
import { MgtModalRoutes } from './views/mgt/routes';

//Lazy Loading
const LoginPage = React.lazy(() => import('./views/public/login'));
const RegisterPage = React.lazy(() => import('./views/public/register'));
const Account = React.lazy(() => import('./views/account'));
const Mgt = React.lazy(() => import('./views/mgt'));
const InModal = React.lazy(() => import('./components/Modal').then((module) => ({ default: module.InModal })));

const router = createBaseRouter(
  createRoutesFromElements(
    <>
      <Route path="/public/:region/:app/login" element={<LoginPage />} />
      <Route path="/public/:region/:app/register" element={<RegisterPage />} />

      <Route path="/account/*" element={<PrivateRoutes element={<Account />} redirect="/public/global/root/login" />} />
      <Route path="/mgt/*" element={<PrivateRoutes element={<Mgt />} redirect="/public/global/root/login" />} />

      <Route
        path={'*/modal'}
        element={
          <InModal>
            <MgtModalRoutes />
          </InModal>
        }
      />
    </>,
  ),
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <Provider context={UserContext}>
        <RouterProvider router={router} />
      </Provider>
    </React.Suspense>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
