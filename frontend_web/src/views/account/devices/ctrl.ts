import { makeObservable, observable } from 'mobx';

export class DevicesConnectedStore {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;

  // Dispositivos conectados
  @observable devices: any[] = [
    { loginAt: '25/10/1986 02:10', device: 'Chrome 01 - Desktop' },
    { loginAt: '25/10/1986 05:10', device: 'Edge - Desktop' },
    { loginAt: '25/10/1986 05:10', device: 'Chrome 01 - Mobile' },
    { loginAt: '25/10/1986 05:10', device: 'Chrome 01 - Desktop' },
  ];
}
