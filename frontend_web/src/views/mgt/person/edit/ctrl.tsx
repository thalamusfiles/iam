import { PersonCRUDDatasource } from '@thalamus/iam-consumer';
import { action, makeObservable, observable } from 'mobx';
import { useParams } from 'react-router-dom';
import { TargetForm } from '../../../../commons/plugin.component';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { CommonEditCtx } from '../../../generic/edit/ctrl';

export class PersonEditStore extends CommonEditCtx {
  datasource = new PersonCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};
  @observable roles: any[] = [
    { id: 0, name: 'Global Super User' },
    { id: 1, name: 'Global Super Viewer' },
  ];
  @observable permissions: any[] = [
    { id: '0', on: 'User', action: 'View', name: 'User_View' },
    { id: '1', on: 'User', action: 'Update', name: 'User_Update' },
    { id: '2', on: 'User', action: 'Delete', name: 'User_Delete' },
    { id: '3', on: 'Roles', action: 'View', name: 'Roles_View' },
    { id: '4', on: 'Roles', action: 'Update', name: 'Roles_Update' },
    { id: '5', on: 'Roles', action: 'Delete', name: 'Roles_Delete' },
    { id: '6', on: 'Permission', action: 'View', name: 'Permission_View' },
    { id: '7', on: 'Permission', action: 'Update', name: 'Permission_Update' },
    { id: '8', on: 'Permission', action: 'Delete', name: 'Permission_Delete' },
    { id: '9', on: 'Region', action: 'View', name: 'Region_View' },
    { id: '10', on: 'Region', action: 'Update', name: 'Region_Update' },
    { id: '11', on: 'Region', action: 'Delete', name: 'Region_Delete' },
    { id: '12', on: 'Application', action: 'View', name: 'Application_View' },
    { id: '13', on: 'Application', action: 'Update', name: 'Application_Update' },
    { id: '14', on: 'Application', action: 'Delete', name: 'Application_Delete' },
  ];

  constructor() {
    super(TargetForm.person_edit, false);

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
      this.content = await this.datasource.findById(id);
      this.loadProfileRoles();

      //Dispara listener informando que o conteu foi carregado
      this.componentsClassesRefs.forEach((comp) => comp.onLoadContent && comp.onLoadContent());
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }

    this.loading = false;
  };

  onSave = async () => {
    this.loading = true;

    try {
      const isNew = !this.content.id;
      let response;

      //Salva o conteudo
      if (isNew) {
        response = await this.datasource.create(this.content);
      } else {
        response = await this.datasource.update(this.content.id, this.content);
      }
      this.content = response.entity;

      notify.success('Saved successfully.');

      if (isNew) {
        historyPush('person_edit', this.content.id);
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
    this.componentsClassesRefs.forEach((comp) => comp.onAssignContent && comp.onAssignContent(values));
  };

  loadProfileRoles = () => {
    /*const { roles } = this.props!.ctrl;
    new ConfigPersonRoleCRUDDatasource().findAll().then((response) => {
      if (response)
        roles = response
    });*/
  };
}
