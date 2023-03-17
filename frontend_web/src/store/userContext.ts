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

  changeLanguage(lng?: string): Promise<Function> {
    return i18next.changeLanguage(lng);
  }

  //Realiza autenticação do usuário
  @action login(username: string, password: string): Promise<any> {
    this.saveUser({ name: 'Test user', id: '', username: 'testuser', email: 'teste@email.com.br' }, 'token');

    return Promise.resolve();

    /*return new AuthDataSource().login(username, password).then((response) => {
      this.saveUser(response.data.user, response.data.access_token);
      historyPush('home');
      return response;
    });*/
  }
  @action logout() {
    this.saveUser({}, null);
    historyPush('login', { region: 'global', app: 'root' });
  }

  //Retorna se usuário esta logado
  @computed get isAuth(): boolean {
    return !!this.token;
  }

  @action loadUser() {
    this.user = Storage.getItem(localStorageDef.userContextKey);
    this.token = Storage.getItem(localStorageDef.tokenKey);
  }

  @action saveUser(user: any, token: string | null) {
    Storage.setItem(localStorageDef.userContextKey, user);
    Storage.setItem(localStorageDef.tokenKey, token);
    this.user = user;
    this.token = token;
  }
}

const UserValue = new Ctx();
export default UserValue;

export const UserContext = createContext<Ctx>({} as Ctx);
export const UserProvider = UserContext.Provider;
export const useUserStore = (): Ctx => useContext(UserContext);
