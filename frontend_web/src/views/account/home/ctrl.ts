import { MeDataSource, UserInfo } from '@piemontez/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class AccountHomeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Informações do usuário logado
  @observable me = null as UserInfo | null;
  // Indica que já foi disparado o init
  started = false;

  @action
  init = () => {
    if (!this.started) {
      this.started = true;

      this.loadUsernInfo();
    }
  };

  @action
  loadUsernInfo = () => {
    new MeDataSource().me().then(
      action((response) => {
        const responseData = response.data;
        this.me = responseData;
      }),
    );
  };
}

export const AccountHomeContext = createContext({} as AccountHomeCtrl);
export const AccountHomeProvider = AccountHomeContext.Provider;
export const useAccountHomeStore = (): AccountHomeCtrl => useContext(AccountHomeContext);
