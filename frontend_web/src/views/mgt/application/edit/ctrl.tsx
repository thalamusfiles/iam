import { ApplicationCRUDDatasource } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class ApplicationEditStore extends CommonEditCtx {
  datasource = new ApplicationCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {
    initials: '',
    name: '',
    description: '',
    public: false,
  };
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @observable managerSelected: {} | null = null;

  constructor() {
    super(TargetForm.application_edit, false);

    makeObservable(this);
  }

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  @action
  loadContent = async (uuid: any) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(uuid, { populate: ['managers.userLogins'] });
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
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

  @action
  onChangeManager = (manager: any) => {
    this.managerSelected = manager;
  };

  @action
  onAddManager = () => {
    if (this.managerSelected) {
      this.content.managers.push(this.managerSelected);
      
      this.managerSelected = null;
    }
  };

  @action 
  onRemoveManager = (manager: any, idx: number) => {
    if (this.content.managers[idx] === manager) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Você deseja remover este registro?') && confirm('Você realmente deseja remover este registro?')) {
        this.content.managers.splice(idx, 1);
      }
    }
  };
}
