import { PermissionCRUDDatasource, RoleCRUDDatasource } from '@piemontez/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class PermissionEditStore extends CommonEditCtx {
  datasource = new PermissionCRUDDatasource();
  roleDatasource = new RoleCRUDDatasource();

  // Conteúdo da tela
  @observable content: any = {
    initials: '',
    on: '',
    action: '',
    description: '',
  };
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  // Escopes/Perfis associados
  @observable contentRoles: any[] = [];

  constructor() {
    super(TargetForm.permission_edit, false);

    makeObservable(this);
  }

  /**
   * Carregas o conteudo da tela
   * @param uuid
   */
  @action
  loadContent = async (uuid: string) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(uuid, { populate: ['application'] });
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while loading register.');
    }

    this.loading = false;
  };

  /**
   *
   */
  @action
  loadRoles = async (uuid: string) => {
    try {
      this.contentRoles = await this.roleDatasource.findAll();
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while loading roles.');
    }
  };

  @action
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

      notify.success('Salvo com sucesso.');
      historyPush(-1);
    } catch (err) {
      const data = (err as any).response?.data;

      [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, {
        splitByConstraints: true,
        removeEntityPrefix: true,
        ignoreKindsToMessage: ['initials', 'name', 'description'],
      }) as ErrosAsList;

      notify.warn(this.erroMessages.join(' '));
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
