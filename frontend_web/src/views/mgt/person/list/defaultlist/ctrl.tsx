import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { CommonListStore } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class PersonListStore extends CommonListStore {
  defaultListDefs: ListDefinition = {
    id: 'users_list',
    name: 'users_list',
    filters: [
      { name: 'username', title: 'Username', type: AttributeType.Text },
      { name: 'name', title: 'Name', type: AttributeType.Text },
    ],
    columns: [
      { colname: 'username', title: 'Username', type: AttributeType.Text, show: true },
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'roles', title: 'Roles', type: AttributeType.Text, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor(...props: any) {
    super(props[0], false);
    makeObservable(this);
  }
}
