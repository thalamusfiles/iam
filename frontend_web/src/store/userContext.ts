import i18next from 'i18next';
import { action, computed, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { localStorageDef } from '../commons/consts';
import '../commons/i18';
import { historyPush } from '../commons/route';
import Storage from '../commons/storage';

export class Ctx {
  constructor() {
    //Modifica classe pra ser observável
    makeObservable(this);

    this.loadUser();
  }

  @observable user: any = {};
  @observable token: string | null = null;
  @observable expiresIn: number | null = null;

  changeLanguage(lng?: string): Promise<Function> {
    return i18next.changeLanguage(lng);
  }

  //Realiza autenticação do usuário
  @action
  login(user: any, token: string | null, expiresIn: number | null): void {
    this.saveUser(user, token, expiresIn);
  }

  @action
  logout() {
    this.saveUser({}, null, null);

    Storage.clear();

    historyPush('login', { region: 'global', app: 'root' });
  }

  //Retorna se usuário esta logado
  @computed
  get isAuth(): boolean {
    return !!this.token;
  }

  @action loadUser() {
    this.user = Storage.getItem(localStorageDef.userContextKey);
    this.token = Storage.getItem(localStorageDef.tokenKey);
    this.expiresIn = Storage.getItem(localStorageDef.tokenKey);
  }

  @action saveUser(user: any, token: string | null, expiresIn: number | null) {
    Storage.setItem(localStorageDef.userContextKey, user);
    Storage.setItem(localStorageDef.tokenKey, token);
    Storage.setItem(localStorageDef.expiresIn, expiresIn);

    this.user = user;
    this.token = token;
    this.expiresIn = expiresIn;
  }
}

const UserCtxInstance = new Ctx();
export default UserCtxInstance;

export const UserContext = createContext<Ctx>({} as Ctx);
export const UserProvider = UserContext.Provider;
export const useUserStore = (): Ctx => useContext(UserContext);
