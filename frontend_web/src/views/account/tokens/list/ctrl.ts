import { TokenDataSource } from '@piemontez/iam-consumer';
import { TokenPermanent } from '@piemontez/iam-consumer/dist/iam';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class TokensCtx {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Dispositivos conectados
  @observable tokens: TokenPermanent[] = [];
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
    new TokenDataSource().findPermanent().then((response) => {
      this.loading = false;
      this.tokens = response.data;
    });
  };
}

export const TokensContext = createContext<TokensCtx>({} as TokensCtx);
export const TokensProvider = TokensContext.Provider;
export const useTokensStore = (): TokensCtx => useContext(TokensContext);
