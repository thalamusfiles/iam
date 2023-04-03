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
      { colname: 'region.name', title: 'Region', type: AttributeType.Text, show: true, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor() {
    super(false);

    makeObservable(this);
  }

  execSearch = async () => {
    console.log(this.filtersApplied.length);
    console.log(this.columns.length);
    console.log(this.page);
    console.log(this.perPage);
    console.log(this.sort);
    console.log(this.sortOrder);

    console.log(await this.datasource.findAll());
    /*
(c: any) => {
          this.cancelRequestCallback = c;
        }
*/
    return [];
  };
}
