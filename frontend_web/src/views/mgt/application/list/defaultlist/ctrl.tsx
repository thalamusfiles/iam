import { ApplicationCRUDDatasource } from '@thalamus/iam-consumer';
import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
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
      { colname: 'description', title: 'Description', type: AttributeType.Text },
      { colname: 'regions.name', title: 'Name', type: AttributeType.Text, show: true },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor() {
    super(false);

    makeObservable(this);
  }

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

    //this.cancelRequestCallback = c;
    return await this.datasource.findAll({ where, populate });
  };
}
