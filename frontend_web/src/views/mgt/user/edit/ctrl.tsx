import { RoleCRUDDatasource, UserCRUDDatasource } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { useParams } from 'react-router-dom';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class UserEditStore extends CommonEditCtx {
  datasource = new UserCRUDDatasource();
  roleDatasource = new RoleCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};
  @observable roles: any[] = [];
  @observable permissions: any[] = [];
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  constructor() {
    super(TargetForm.user_edit, false);

    makeObservable(this);
  }

  afterBuild = async () => {
    const { id } = useParams();
    if (id) {
      this.loadContent(id);
    }
  };

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  loadContent = async (id: any) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(id, { populate: ['userLogins', 'roles'] });
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
  };

  loadRoles = async () => {
    this.roles = await this.roleDatasource.findAll();
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
