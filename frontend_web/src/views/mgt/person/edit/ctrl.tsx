import { action, makeObservable, observable } from 'mobx';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonCRUDDatasource } from '../../../../datasources/apicrud';
import { CRUDInterface } from '../../../../datasources/apicrud/api';
import { CommonEditStore } from '../../../generic/edit/ctrl';

export class PersonEditStore extends CommonEditStore {
  datasource: CRUDInterface = new PersonCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};
  @observable configPersonRoles: [] = [];

  constructor(...props: any) {
    super(props[0], false);
    makeObservable(this);
  }

  afterBuild = async () => {
    const { id } = this.match.params;
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
}
