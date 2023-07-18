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
  @observable response_type = null as string | null;
  @observable redirect_uri = null as string | null;
  @observable applicationUuid = null as string | null;
  @observable scope = null as string | null;
  @observable state = null as string | null;
  @observable code_challenge = null as string | null;
  @observable code_challenge_method = null as string | null;

  // Modals
  @observable permissionModalDisplay: boolean = false;

  @action
  setParams = (
    applicationUuid: string,
    response_type: string | null,
    redirect_uri: string | null,
    scope: string | null,
    state: string | null,
    code_challenge: string | null,
    code_challenge_method: string | null,
  ) => {
    const isChange = this.applicationUuid !== applicationUuid;

    this.applicationUuid = applicationUuid;
    this.response_type = response_type;
    this.redirect_uri = redirect_uri;
    this.scope = scope;
    this.state = state;
    this.code_challenge = code_challenge;
    this.code_challenge_method = code_challenge_method;

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
          response_type: this.response_type || 'cookie',
          redirect_uri: this.redirect_uri || undefined,
          client_id: this.applicationUuid!,
          scope: this.scope!,
          state: this.state || undefined,
          code_challenge: this.code_challenge || undefined,
          code_challenge_method: this.code_challenge_method || undefined,
        },
      )
      .then((response) => {
        const responseData = response.data;
        // Adicionar o token de acesso no consumidar da API
        IamApisConfigure.setGlobalAuthorizationToken(responseData.access_token);
        IamApisConfigure.setGlobalApplication(responseData.info.applicationLogged);
        // Regista o Register no contexto do usuário
        UserCtxInstance.login(responseData.info, responseData.access_token, responseData.info.expires_in);

        if (responseData.callbackUri) {
          window.location.href = responseData.callbackUri;
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
    historyPush('login', { app: this.applicationUuid, search: { scope: this.scope, redirect_uri: this.redirect_uri } });
  };
}

export const RegisterContext = createContext({} as RegisterCtrl);
export const RegisterProvider = RegisterContext.Provider;
export const useRegisterStore = (): RegisterCtrl => useContext(RegisterContext);
