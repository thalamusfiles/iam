import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { CommonListStore } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class RoleListStore extends CommonListStore {
  defaultListDefs: ListDefinition = {
    id: 'roles_list',
    name: 'roles_list',
    filters: [{ name: 'role', title: 'Role', type: AttributeType.Text }],
    columns: [
      { colname: 'name', title: 'Role', type: AttributeType.Text, sortable: false, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text, sortable: false, show: true },
      { colname: 'application.name', title: 'Application', type: AttributeType.Text },
      { colname: 'region.name', title: 'Region', type: AttributeType.Text },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor(...props: any) {
    super(props[0], false);
    makeObservable(this);
  }
}
