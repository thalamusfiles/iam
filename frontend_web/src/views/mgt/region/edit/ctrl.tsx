import { action, makeObservable, observable } from 'mobx';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { RegionCRUDDatasource } from '../../../../datasources/apicrud';
import { CRUDInterface } from '../../../../datasources/apicrud/api';
import { CommonEditStore } from '../../../generic/edit/ctrl';

export class RegionEditStore extends CommonEditStore {
  datasource: CRUDInterface = new RegionCRUDDatasource();

  //Conteudo da tela
  @observable content: any = {};
  @observable applications: any[] = [
    { id: 0, name: 'Application 01', description: 'Description 01' },
    { id: 1, name: 'Application 02', description: 'Description 02' },
    { id: 2, name: 'Application 03', description: 'Description 03' },
  ];

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
        historyPush('region_edit', this.content.id);
      }
    } catch (err) {
      const message = (err as any).response?.data?.message || 'An error occurred while saving.';
      notify.warn(message);
    }

    this.loading = false;
  };

  /**
   * Attribui os valoes informados ?? vari??vel content
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
