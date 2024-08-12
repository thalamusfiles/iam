import { TokenDataSource, TokenInfo } from '@piemontez/iam-consumer';
import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { UAParser } from 'ua-parser-js';

export class LoginsCtx {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Dispositivos conectados
  @observable logins: TokenInfo[] = [];
  // Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;
  // Indica que já foi disparado o init
  started = false;

  @action
  init = () => {
    if (!this.started) {
      this.started = true;

      this.loadDefices();
    }
  };

  @action
  loadDefices = () => {
    this.loading = true;

    // Carrega os logins ativos
    new TokenDataSource().findAll().then(
      action((response) => {
        this.loading = false;

        const responseData = response.data;

        this.logins = responseData.map((device) => {
          const uap = new UAParser(device.userAgent);
          device.userAgent = `${uap.getOS().name}/${uap.getOS().version} ${uap.getBrowser().name} ${uap.getBrowser().version}`;
          device.createdAt = DateTime.fromISO(device.createdAt).toFormat('dd/MM/yyyy HH:mm');

          return device;
        });
      }),
    );
  };
}

export const LoginsContext = createContext<LoginsCtx>({} as LoginsCtx);
export const LoginsProvider = LoginsContext.Provider;
export const useLoginStore = (): LoginsCtx => useContext(LoginsContext);
