import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import './assets/fontawasome.library';
import './assets/theme.scss';
import { history, PrivateRoutes } from './commons/route';
import * as serviceWorker from './serviceWorker';
import UserContext from './store/userContext';
import { MgtModalRoutes } from './views/mgt/routes';

//Lazy Loading
const LoginPage = React.lazy(() => import('./views/public/login'));
const RegisterPage = React.lazy(() => import('./views/public/register'));
const Account = React.lazy(() => import('./views/account'));
const Mgt = React.lazy(() => import('./views/mgt'));
const InModal = React.lazy(() => import('./components/Modal').then((module) => ({ default: module.InModal })));

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <Provider context={UserContext}>
        <Router history={history}>
          <Switch>
            <Route path={'/public/:region/:app/login'} component={LoginPage} />
            <Route path={'/public/:region/:app/register'} component={RegisterPage} />
            <PrivateRoutes redirect="/public/global/root/login">
              <Route path={'/account'} component={Account} />
              <Route path={'/mgt'} component={Mgt} />
              <Route path={'/'} exact render={() => <Redirect to="/mgt" />} />
            </PrivateRoutes>
          </Switch>
          <PrivateRoutes>
            <Route path={'*/modal'}>
              <InModal>
                <MgtModalRoutes />
              </InModal>
            </Route>
          </PrivateRoutes>
        </Router>
      </Provider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
