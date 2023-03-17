import { makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class DevicesConnectedCtx {
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

export const DevicesConnectedContext = createContext<DevicesConnectedCtx>({} as DevicesConnectedCtx);
export const DevicesConnectedProvider = DevicesConnectedContext.Provider;
export const useDevicesConnectedStore = (): DevicesConnectedCtx => useContext(DevicesConnectedContext);
