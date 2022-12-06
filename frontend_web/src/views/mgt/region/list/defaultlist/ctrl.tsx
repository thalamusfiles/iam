import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { CommonListStore } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class RegionListStore extends CommonListStore {
  defaultListDefs: ListDefinition = {
    id: 'regions_list',
    name: 'regions_list',
    filters: [{ name: 'name', title: 'Name', type: AttributeType.Text }],
    columns: [
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text, show: true },
      { colname: 'application.name', title: 'Application', type: AttributeType.Text, sortable: false },
      { colname: 'region.name', title: 'Region', type: AttributeType.Text, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor(...props: any) {
    super(props[0], false);
    makeObservable(this);
  }
}
