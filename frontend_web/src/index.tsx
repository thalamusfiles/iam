import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import './assets/fontawasome.library';
import './assets/theme.scss';
import { createBaseRouter, PrivateRoutes } from './commons/route';
import iamConfig from './config/iam.config';
import * as serviceWorker from './serviceWorker';
import UserCtxInstance, { UserProvider } from './store/userContext';
import { MgtModalRoutes } from './views/mgt/routes';

//Lazy Loading
const LoginPage = React.lazy(() => import('./views/public/login'));
const RegisterPage = React.lazy(() => import('./views/public/register'));
const Account = React.lazy(() => import('./views/account'));
const Mgt = React.lazy(() => import('./views/mgt'));
const InModal = React.lazy(() => import('./components/Modal').then((module) => ({ default: module.InModal })));

const accountRoute = `/public/app/${iamConfig.MAIN_APP_IAM_ID}/login`;
const mgtRoute = `/public/app/${iamConfig.MAIN_APP_IAM_MGT_ID}/login`;

const router = createBaseRouter(
  createRoutesFromElements(
    <>
      <Route path="/public/app/:app/login" element={<LoginPage />} index />
      <Route path="/public/app/:app/register" element={<RegisterPage />} />

      <Route path="/account/*" element={<PrivateRoutes element={<Account />} redirect={accountRoute} />} />
      <Route path="/mgt/*" element={<PrivateRoutes element={<Mgt />} redirect={mgtRoute} />} />

      <Route
        path={'*/modal'}
        element={
          <InModal>
            {' '}
            <MgtModalRoutes />{' '}
          </InModal>
        }
      />
      <Route path="/" element={<Navigate to={accountRoute} replace />} />
    </>,
  ),
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <UserProvider value={UserCtxInstance}>
        <RouterProvider router={router} />
      </UserProvider>
    </React.Suspense>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
