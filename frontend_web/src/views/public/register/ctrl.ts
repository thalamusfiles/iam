import { ApplicationInfo, AuthDataSource, IamApisConfigure, OauthDataSource, ScopeInfo } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import type { ErrosAsList } from '../../../commons/error';
import { getFormExceptionErrosToObject } from '../../../commons/error';
import { historyPush } from '../../../commons/route';
import type { ErrorListRecord } from '../../../commons/types/ErrorListRecord';
import UserCtxInstance from '../../../store/userContext';

export class RegisterCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Register
  @observable name = '';
  @observable username = '';
  @observable password = '';
  @observable passwordConfirmed = '';
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {
    name: null as string[] | null,
    username: null as string[] | null,
    password: null as string[] | null,
    password_confirmed: null as string[] | null,
  };
  @observable appInfo: ApplicationInfo | null = null;
  @observable scopeInfo: ScopeInfo[] | null = null;

  // Oauth
  @observable redirectTo = null as string | null;
  @observable applicationUuid = null as string | null;
  @observable scope = null as string | null;

  // Modals
  @observable permissionModalDisplay: boolean = false;

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
  loadApplicationInfo = () => {
    new OauthDataSource().applicationInfo(this.applicationUuid!).then((response) => {
      this.appInfo = response.data;
    });
  };

  @action
  loadScopeInfo = () => {
    new OauthDataSource().scopeInfo(this.scope!).then((response) => {
      this.scopeInfo = response.data;
    });
  };

  @action
  showPermissionModal = () => {
    this.permissionModalDisplay = true;
  };

  @action
  hidePermissionModal = () => {
    this.permissionModalDisplay = false;
  };

  @action
  handleName = (e: any): void => {
    this.name = e.target.value;
  };

  @action
  handleUsername = (e: any): void => {
    this.username = e.target.value;
  };

  @action
  handlePassword = (e: any): void => {
    this.password = e.target.value;
  };

  @action
  handlePasswordConfirmed = (e: any): void => {
    this.passwordConfirmed = e.target.value;
  };

  onKeyUpFilter = (e: any): void => {
    if (e.charCode === 13) {
      this.toRegister();
    }
  };

  @action
  toRegister = () => {
    new AuthDataSource()
      .register(
        { name: this.name, username: this.username, password: this.password, password_confirmed: this.passwordConfirmed },
        {
          response_type: 'cookie',
          scope: this.scope!,
          cliente_id: this.applicationUuid!,
          redirect_uri: this.redirectTo || undefined,
        },
      )
      .then((response) => {
        const responseData = response.data;
        // Adicionar o token de acesso no consumidar da API
        IamApisConfigure.setGlobalAuthorizationToken(responseData.access_token);
        // Regista o Register no contexto do usuário
        UserCtxInstance.login(responseData.info, responseData.access_token, responseData.info.expires_in);

        if (this.redirectTo) {
          window.location.href = this.redirectTo;
        }
      })
      .catch((error: any) => {
        const data = error.response?.data;

        [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, {
          splitByConstraints: true,
          ignoreKindsToMessage: ['name', 'username', 'password', 'password_confirmed'],
        }) as ErrosAsList;
      });
  };

  toLogin = () => {
    historyPush('login', { app: this.applicationUuid, search: { scope: this.scope, redirectTo: this.redirectTo } });
  };
}

export const RegisterContext = createContext({} as RegisterCtrl);
export const RegisterProvider = RegisterContext.Provider;
export const useRegisterStore = (): RegisterCtrl => useContext(RegisterContext);
