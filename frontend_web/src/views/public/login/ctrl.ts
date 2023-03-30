import { ApplicationInfo, AuthDataSource, OauthDataSource, ScopeInfo } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import type { ErrosAsList } from '../../../commons/error';
import { getFormExceptionErrosToObject } from '../../../commons/error';
import { historyPush } from '../../../commons/route';
import type { ErrorListRecord } from '../../../commons/types/ErrorListRecord';
import UserCtxInstance from '../../../store/userContext';

export class LoginCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Login
  @observable username = '';
  @observable password = '';
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = { username: null as string[] | null, password: null as string[] | null };
  @observable appInfo: ApplicationInfo | null = null;
  @observable scopeInfo: ScopeInfo[] | null = null;

  // Oauth
  @observable redirectTo = null as string | null;
  @observable applicationUuid = null as string | null;
  @observable scope = null as string | null;

  @action
  setParams = (applicationUuid: string, redirectTo: string | null, scope: string | null) => {
    const isChange = this.applicationUuid !== applicationUuid;

    this.applicationUuid = applicationUuid;
    this.redirectTo = redirectTo;
    this.scope = scope;

    if (isChange) {
      this.loadApplicationInfo();
      this.loadScopeInfo();
    }
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
  loadApplicationInfo = () => {
    new OauthDataSource().applicationInfo(this.applicationUuid!).then((response) => {
      this.appInfo = response.data;
    });
  };

  @action
  loadScopeInfo = () => {
    console.log(OauthDataSource);
    new OauthDataSource().scopeInfo(this.scope!).then((response) => {
      this.scopeInfo = response.data;
      alert(JSON.stringify(this.scopeInfo));
    });
  };

  @action
  toLogin = () => {
    new AuthDataSource()
      .login(
        { username: this.username, password: this.password },
        {
          response_type: 'cookie',
          scope: this.scope!,
          cliente_id: this.applicationUuid!,
          redirect_uri: this.redirectTo || undefined,
        },
      )
      .then((response) => {
        const responseData = response.data;
        UserCtxInstance.login(responseData.user, responseData.access_token);

        if (this.redirectTo) {
          window.location.href = this.redirectTo;
        } else {
          historyPush('home');
        }
      })
      .catch((error: any) => {
        const data = error.response?.data;

        [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, {
          splitByConstraints: true,
          ignoreKindsToMessage: ['username', 'password'],
        }) as ErrosAsList;
      });
  };

  toRegister = () => {
    historyPush('register', { app: this.applicationUuid });
  };
}

export const LoginContext = createContext({} as LoginCtrl);
export const LoginProvider = LoginContext.Provider;
export const useLoginStore = (): LoginCtrl => useContext(LoginContext);
