import { PermissionCRUDDatasource, RoleCRUDDatasource, UserCRUDDatasource } from '@piemontez/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { useParams } from 'react-router-dom';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

type PermInfo = { uuid: string; on: string; action: string; initials: string };

export class UserEditStore extends CommonEditCtx {
  datasource = new UserCRUDDatasource();
  roleDatasource = new RoleCRUDDatasource();
  permissionDatasource = new PermissionCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @observable roles: any[] = [];
  @observable rolesPermissionsUuids: Record<string, string[]> = {};
  @observable permissionsUuids: string[] = [];
  @observable permissions: PermInfo[] = [];
  @observable permissionsOns: string[] = [];
  @observable permissionsActs: string[] = [];
  @observable permissionsByOnAct: Record<string, PermInfo> = {};

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
  @action
  loadContent = async (id: any) => {
    this.loading = true;

    try {
      //Carrega o conteudo
      this.content = await this.datasource.findById(id, { populate: ['userLogins', 'roles'] });
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }
    this.loadPermissions();

    this.loading = false;
  };

  @action
  loadRoles = async () => {
    this.roles = await this.roleDatasource.findAll({ populate: ['permissions'] });

    this.rolesPermissionsUuids = this.roles.reduce((last, role) => {
      last[role.uuid] = role.permissions.map((permission: any) => permission.uuid);
      return last;
    }, {});
  };

  @action
  loadPermissions = async () => {
    const rolesUuids = this.content.userRoles?.map((role: any) => role.uuid) || [];

    const rolePermissionsUuids = rolesUuids.map((roleUuid: string) => this.rolesPermissionsUuids[roleUuid]);
    this.permissionsUuids = rolePermissionsUuids.flat();

    // Se não tiver nenhum escopo/perfil selecionado
    if (!rolesUuids.length) {
      this.permissions = [];
      this.permissionsOns = [];
      this.permissionsActs = [];
      return;
    }

    const permissions: PermInfo[] = await this.permissionDatasource.findAll({ roles: rolesUuids });

    this.permissions = permissions;
    this.permissionsOns = permissions.map((perm) => perm.on).filter((v, idx, self) => self.indexOf(v) === idx);
    this.permissionsActs = permissions.map((perm) => perm.action).filter((v, idx, self) => self.indexOf(v) === idx);

    // Cria um objeto com as permissões onde a chave é a ação
    this.permissionsByOnAct = permissions.reduce((last, cur) => {
      const key = `${cur.on}.${cur.action}`;
      last[key] = cur;
      return last;
    }, {} as Record<string, PermInfo>);
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

  @action
  toggleUserRole = (role: any) => {
    const userRoles = this.content.roles || [];

    // Caso já tenha o escopo/perfil retorna a posição dele no content
    const idx = userRoles.findIndex((userRole: any) => userRole.uuid === role.uuid);

    if (idx > -1) {
      // Remove da lista
      userRoles.splice(idx, 1);
    } else {
      // Adiciona a lista
      userRoles.push(role);
    }
    this.assignContent({
      userRoles: userRoles,
    });

    this.loadPermissions();
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
