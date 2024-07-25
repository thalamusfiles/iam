import { RoleCRUDDatasource } from '@piemontez/iam-consumer';
import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { historyPush } from '../../../../../commons/route';
import { CommonListCtx } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class RoleListStore extends CommonListCtx {
  datasource = new RoleCRUDDatasource();

  defaultListDefs: ListDefinition = {
    id: 'roles_list',
    name: 'roles_list',
    filters: [{ name: 'name', title: 'Name', type: AttributeType.Text }],
    columns: [
      { colname: 'initials', title: 'Scope / Perfil', type: AttributeType.Text, show: true },
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text, show: true },
      { colname: 'application.name', title: 'Application', type: AttributeType.Text, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Asc,
  };

  constructor() {
    super(false);

    makeObservable(this);
  }

  newCallback = () => {
    historyPush('role_new', { inModal: true, showSave: true });
  };

  editCallback = (uuid: number | string) => {
    historyPush('role_edit', { uuid, inModal: true, showSave: true });
  };

  removeCallback = (uuid: number | string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Você deseja remover este registro?') && confirm('Você realmente deseja remover este registro?')) {
      this.datasource.remove(uuid as any).then(() => {
        this.search();
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
