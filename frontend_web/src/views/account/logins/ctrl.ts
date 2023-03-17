import { makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class LoginCtx {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;

  // Logins realizados
  @observable logins: any[] = [
    { loginAt: '25/10/1986 02:10', applicationName: 'CNAES' },
    { loginAt: '25/10/1986 05:10', applicationName: 'CNAES' },
    { loginAt: '25/10/1986 05:10', applicationName: 'WMS' },
  ];
}

export const LoginContext = createContext<LoginCtx>({} as LoginCtx);
export const LoginProvider = LoginContext.Provider;
export const useLoginStore = (): LoginCtx => useContext(LoginContext);
