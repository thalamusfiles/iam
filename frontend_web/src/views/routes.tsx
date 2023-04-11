import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PrivateRoutes } from '../commons/route';
import iamConfig from '../config/iam.config';

//Lazy Loading
const LoginPage = React.lazy(() => import('./public/login'));
const RegisterPage = React.lazy(() => import('./public/register'));
const Account = React.lazy(() => import('./account'));
const Mgt = React.lazy(() => import('./mgt'));

const accountLoginRoute = `/public/app/${iamConfig.MAIN_APP_IAM_ID}/login?scope=${iamConfig.DEFAULT_SCOPE}&redirectTo=${window.location.origin}/account`;
const mgtLoginRoute = `/public/app/${iamConfig.MAIN_APP_IAM_MGT_ID}/login?scope=${iamConfig.DEFAULT_SCOPE}&redirectTo=${window.location.origin}/mgt/home/modal/context/change_application`;

const routes = (
  <>
    <Route path="/public/app/:app/login" element={<LoginPage />} index />
    <Route path="/public/app/:app/register" element={<RegisterPage />} />

    <Route path="/account/*" element={<PrivateRoutes element={<Account />} redirect={accountLoginRoute} />} />
    <Route path="/mgt/*" element={<PrivateRoutes element={<Mgt />} redirect={mgtLoginRoute} />} />

    <Route path="/" element={<Navigate to={accountLoginRoute} replace />} />
  </>
);

export default routes;
