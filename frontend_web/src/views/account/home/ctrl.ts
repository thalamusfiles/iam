import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class AccountHomeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  @observable me = {};

  loaded = false;

  @action
  init = () => {
    if (!this.loaded) {
      this.loadUsernInfo();

      this.loaded = true;
    }
  };

  @action
  loadUsernInfo = () => {};
}

export const AccountHomeContext = createContext({} as AccountHomeCtrl);
export const AccountHomeProvider = AccountHomeContext.Provider;
export const useAccountHomeStore = (): AccountHomeCtrl => useContext(AccountHomeContext);
