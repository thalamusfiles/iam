import { ApplicationCRUDDatasource, ApplicationInfo } from '@piemontez/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class ApplicationInfoCtrl {
  datasource = new ApplicationCRUDDatasource();

  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // Informações da applicação
  @observable appInfo: ApplicationInfo | null = null;
  // Oauth
  @observable applicationUuid = null as string | null;

  @action
  setParams = (applicationUuid: string) => {
    const isChange = this.applicationUuid !== applicationUuid;

    this.applicationUuid = applicationUuid;
    if (isChange) {
      this.loadApplicationInfo();
    }
  };

  @action
  loadApplicationInfo = async () => {
    this.datasource
      .findById(this.applicationUuid!)
      .then((response) => {
        this.appInfo = response;
      })
      .catch(() => {});
  };
}

export const ApplicationInfoContext = createContext({} as ApplicationInfoCtrl);
export const ApplicationInfoProvider = ApplicationInfoContext.Provider;
export const useApplicationInfoStore = (): ApplicationInfoCtrl => useContext(ApplicationInfoContext);
