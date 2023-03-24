import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { getFormExceptionErrosToObject } from '../../../commons/error';
import { historyPush } from '../../../commons/route';
import UserCtxInstance from '../../../store/userContext';

export class LoginCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Login
  @observable username = '';
  @observable password = '';
  @observable erroMessage = '';
  @observable erros = { username: null as string | null, password: null as string | null };

  // Oauth
  @observable redirectTo = null as string | null;
  @observable app = null as string | null;
  @observable scope = null as string | null;

  @action
  setParams = (app: string, redirectTo: string | null, scope: string | null) => {
    this.app = app;
    this.redirectTo = redirectTo;
    this.scope = scope;
  };

  @action
  handleUsername = (e: any): void => {
    this.username = e.target.value;
  };

  @action
  handlePassword = (e: any): void => {
    this.password = e.target.value;
  };

  onKeyUpFilter = (e: any): void => {
    if (e.charCode === 13) {
      this.toLogin();
    }
  };

  @action
  toLogin = () => {
    UserCtxInstance.login(this.username, this.password, {
      scope: this.scope!,
      cliente_id: this.app!,
      redirect_uri: this.redirectTo || undefined,
    })
      .then(() => {
        historyPush('home');
      })
      .catch((error: any) => {
        const data = error.response?.data;

        [this.erroMessage, this.erros] = getFormExceptionErrosToObject(data, ['username', 'password']);
      });
  };

  toRegister = () => {
    historyPush('register', { app: this.app });
  };
}

export const LoginContext = createContext({} as LoginCtrl);
export const LoginProvider = LoginContext.Provider;
export const useLoginStore = (): LoginCtrl => useContext(LoginContext);
