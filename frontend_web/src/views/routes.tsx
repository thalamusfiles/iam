import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PrivateRoutes } from '../commons/route';
import iamConfig from '../config/iam.config';
import { MgtModalRoutes } from '../views/mgt/routes';

//Lazy Loading
const LoginPage = React.lazy(() => import('./public/login'));
const RegisterPage = React.lazy(() => import('./public/register'));
const Account = React.lazy(() => import('./account'));
const Mgt = React.lazy(() => import('./mgt'));
const InModal = React.lazy(() => import('../components/Modal').then((module) => ({ default: module.InModal })));

const accountLoginRoute = `/public/app/${iamConfig.MAIN_APP_IAM_ID}/login?scope=${iamConfig.DEFAULT_SCOPE}`;
const mgtLoginRoute = `/public/app/${iamConfig.MAIN_APP_IAM_MGT_ID}/login?scope=${iamConfig.DEFAULT_SCOPE}`;

const routes = (
  <>
    <Route path="/public/app/:app/login" element={<LoginPage />} index />
    <Route path="/public/app/:app/register" element={<RegisterPage />} />

    <Route path="/account/*" element={<PrivateRoutes element={<Account />} redirect={accountLoginRoute} />} />
    <Route path="/mgt/*" element={<PrivateRoutes element={<Mgt />} redirect={mgtLoginRoute} />} />

    <Route
      path={'*/modal'}
      element={
        <InModal>
          {' '}
          <MgtModalRoutes />{' '}
        </InModal>
      }
    />
    <Route path="/" element={<Navigate to={accountLoginRoute} replace />} />
  </>
);

export default routes;
