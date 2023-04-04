import { ApplicationCRUDDatasource } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class ApplicationEditStore extends CommonEditCtx {
  datasource = new ApplicationCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};

  constructor() {
    super(TargetForm.application_edit, false);

    makeObservable(this);
  }

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  loadContent = async (uuid: any) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(uuid);
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
  };

  onSave = async () => {
    this.loading = true;

    try {
      const isNew = !this.content.uuid;
      let response;

      //Salva o conteudo
      if (isNew) {
        response = await this.datasource.create(this.content);
      } else {
        response = await this.datasource.update(this.content.uuid, this.content);
      }
      this.content = response.entity;

      notify.success('Saved successfully.');

      if (isNew) {
        historyPush('application_edit', this.content.id);
      }
    } catch (err) {
      const message = (err as any).response?.data?.message || 'An error occurred while saving.';
      notify.warn(message);
    }

    this.loading = false;
  };

  /**
   * Attribui os valoes informados à variável content
   * e dispara a o evento onAssignContent
   * @param values
   */
  @action
  assignContent = (values: any, cleanup: boolean = false) => {
    if (cleanup) {
      this.content = Object.assign({}, values);
    } else {
      this.content = Object.assign({}, this.content, values);
    }
  };
}
