import { makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class LoginsCtx {
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

export const LoginsContext = createContext<LoginsCtx>({} as LoginsCtx);
export const LoginsProvider = LoginsContext.Provider;
export const useLoginStore = (): LoginsCtx => useContext(LoginsContext);
