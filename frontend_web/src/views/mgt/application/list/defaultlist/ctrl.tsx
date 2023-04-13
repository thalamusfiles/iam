import { ApplicationCRUDDatasource } from '@thalamus/iam-consumer';
import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { historyPush } from '../../../../../commons/route';
import { notify } from '../../../../../components/Notification';
import { CommonListCtx } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class ApplicationListStore extends CommonListCtx {
  datasource = new ApplicationCRUDDatasource();

  defaultListDefs: ListDefinition = {
    id: 'applications_list',
    name: 'applications_list',
    filters: [
      { name: 'initials', title: 'Initials', type: AttributeType.Text },
      { name: 'name', title: 'Name', type: AttributeType.Text },
    ],
    columns: [
      { colname: 'initials', title: 'Initials', type: AttributeType.Text, show: true },
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'public', title: 'Public?', type: AttributeType.Boolean, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text },
      { colname: 'managers.name', title: 'Managers', type: AttributeType.Text, show: true },
    ],
    sort: { colname: 'name' } as any,
    sortOrder: SortOrder.Asc,
  };

  constructor() {
    super(false);

    makeObservable(this);
  }

  newCallback = () => {
    historyPush('application_new', { inModal: true, showSave: true });
  };

  editCallback = (uuid: number | string) => {
    historyPush('application_edit', { uuid, inModal: true, showSave: true });
  };

  removeCallback = (uuid: number | string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Você deseja remover este registro?') && confirm('Você realmente deseja remover este registro?')) {
      this.datasource
        .remove(uuid as any)
        .then(() => {
          this.search();
        })
        .catch((error) => {
          const response = error.response;
          notify.danger(response.data?.message || error.message);
        });
    }
  };

  execSearch = async () => {
    // Monta os filtros da api mgt conforme os filtros da tela
    const where = this.filtersApplied.reduce((prev, curr) => {
      prev[curr.name] = curr.value;
      return prev;
    }, {} as any);

    // Coleta as informações populate
    const populate = this.columns
      .filter((column) => column.colname.includes('.'))
      .map((column) => column.colname.substring(0, column.colname.indexOf('.')));

    const limit = this.perPage;
    const offset = (this.page - 1) * this.perPage;
    const order_by = [`${this.sort?.colname}:${SortOrder[this.sortOrder]}`];

    //this.cancelRequestCallback = c;
    return await this.datasource.findAll({ where, populate, order_by, limit, offset });
  };
}
