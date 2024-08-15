import { ApplicationCRUDDatasource, IamApisConfigure } from '@piemontez/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import UserCtxInstance from '../../../../store/userContext';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class ApplicationEditStore extends CommonEditCtx {
  datasource = new ApplicationCRUDDatasource();

  //Conteudo da tela
  @observable applications = [] as { name: string; description: string }[];

  constructor() {
    super(TargetForm.application_edit, false);

    makeObservable(this);
  }

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  @action
  loadApplications = async () => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.applications = await this.datasource.findAll();
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
  };

  @action
  changeApplication = (application: any) => {
    UserCtxInstance.saveApplication(application);
    IamApisConfigure.setGlobalApplication(application.uuid);
    historyPush('home_mgt');
  };
}
