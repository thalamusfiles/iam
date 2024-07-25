import { TokenDataSource, TokenInfo } from '@piemontez/iam-consumer';
import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { UAParser } from 'ua-parser-js';

export class TokensCtx {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Dispositivos conectados
  @observable tokens: TokenInfo[] = [];
  // Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;
  // Indica que já foi disparado o init
  started = false;

  @action
  init = () => {
    if (!this.started) {
      this.started = true;

      this.loadTokens();
    }
  };

  @action
  loadTokens = () => {
    this.loading = true;

    // Carrega os logins ativos
    new TokenDataSource().findAll().then((response) => {
      this.loading = false;

      const responseData = response.data;

      this.tokens = responseData.map((device) => {
        const uap = new UAParser(device.userAgent);
        device.userAgent = `${uap.getOS().name}/${uap.getOS().version} ${uap.getBrowser().name} ${uap.getBrowser().version}`;
        device.createdAt = DateTime.fromISO(device.createdAt).toFormat('dd/MM/yyyy HH:mm');

        return device;
      });
    });
  };
}

export const TokensContext = createContext<TokensCtx>({} as TokensCtx);
export const TokensProvider = TokensContext.Provider;
export const useTokensStore = (): TokensCtx => useContext(TokensContext);
