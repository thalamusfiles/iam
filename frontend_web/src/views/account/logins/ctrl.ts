import { makeObservable, observable } from 'mobx';

export class LoginStore {
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
