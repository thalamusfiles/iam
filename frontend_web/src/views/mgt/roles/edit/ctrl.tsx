import { PermissionCRUDDatasource, RoleCRUDDatasource } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

type PermInfo = { uuid: string; on: string; action: string; initials: string };

export class RoleEditStore extends CommonEditCtx {
  datasource = new RoleCRUDDatasource();
  permissionDatasource = new PermissionCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {
    initials: '',
    name: '',
    description: '',
  };
  @observable contentPermissionsUuids: string[] = [];
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @observable permissions: PermInfo[] = [];
  @observable permissionsOns: string[] = [];
  @observable permissionsActs: string[] = [];
  @observable permissionsOnActTree: Array<[string, string[]]> = [];
  @observable permissionsByOnAct: Record<string, PermInfo> = {};

  constructor() {
    super(TargetForm.role_edit, false);

    makeObservable(this);
  }

  loadPermissions = async () => {
    const permissions: PermInfo[] = await this.permissionDatasource.findAll();

    this.permissions = permissions;

    this.permissionsOns = permissions.map((perm) => perm.on).filter((v, idx, self) => self.indexOf(v) === idx);
    this.permissionsActs = permissions.map((perm) => perm.action).filter((v, idx, self) => self.indexOf(v) === idx);

    // Criar uma lista de ações tipo: [ ['TelaX', ['Ver','Alterar']], ['TelaY', ['Ver']]]
    this.permissionsOnActTree = Object.entries(
      permissions.reduce((last, cur) => {
        if (!last[cur.on]) {
          last[cur.on] = [];
        }
        last[cur.on].push(cur.action);
        return last;
      }, {} as Record<string, string[]>),
    );

    // Cria um objeto com as permissões onde a chave é a ação
    this.permissionsByOnAct = permissions.reduce((last, cur) => {
      const key = `${cur.on}.${cur.action}`;
      last[key] = cur;
      return last;
    }, {} as Record<string, PermInfo>);
  };

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  loadContent = async (id: any) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(id, { populate: ['permissions', 'application'] });
      this.contentPermissionsUuids = this.content.permissions.map((permission: any) => permission.uuid);
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
  };

  /**
   * Check ou descheca a permissão
   * @param uuid
   */
  togglePermission = (uuid: string) => {
    const idx = this.contentPermissionsUuids.indexOf(uuid);
    if (idx > -1) {
      this.contentPermissionsUuids.splice(idx, 1);
    } else {
      this.contentPermissionsUuids.push(uuid);
    }
  };

  onSave = async () => {
    this.loading = true;

    try {
      const isNew = !this.content.uuid;
      let response;

      this.content.permissions = this.permissions.filter((perm) => this.contentPermissionsUuids.includes(perm.uuid));

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
