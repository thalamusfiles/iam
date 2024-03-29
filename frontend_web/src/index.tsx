import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoutesFromElements, RouterProvider } from 'react-router-dom';
import './assets/fontawasome.library';
import './assets/theme.scss';
import { createBaseRouter } from './commons/route';
import apiConfigure from './config/api.config';
import * as serviceWorker from './serviceWorker';
import UserCtxInstance, { UserProvider } from './store/userContext';
import routes from './views/routes';

UserCtxInstance.loadUser();
UserCtxInstance.loadApplication();
apiConfigure(UserCtxInstance.token, UserCtxInstance.application.uuid);

const router = createBaseRouter(createRoutesFromElements(routes));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  /*<React.StrictMode>*/
    <React.Suspense fallback="loading">
      <UserProvider value={UserCtxInstance}>
        <RouterProvider router={router} />
      </UserProvider>
    </React.Suspense>
  /*</React.StrictMode>*/,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
