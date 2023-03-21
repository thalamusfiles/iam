import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { CommonListCtx } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class PermissionListStore extends CommonListCtx {
  defaultListDefs: ListDefinition = {
    id: 'permissions_list',
    name: 'permissions_list',
    filters: [{ name: 'name', title: 'Name', type: AttributeType.Text }],
    columns: [
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'on', title: 'On', type: AttributeType.Text, show: true },
      { colname: 'action', title: 'Action', type: AttributeType.Text, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text, show: true },
      { colname: 'application.name', title: 'Application', type: AttributeType.Text, sortable: false },
      { colname: 'region.name', title: 'Region', type: AttributeType.Text, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor() {
    super({}, false);
    
    makeObservable(this);
  }
}
