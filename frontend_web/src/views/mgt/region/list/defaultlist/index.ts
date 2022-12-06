import { historyPush } from '../../../../../commons/route';
import { RegionGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { RegionListStore } from './ctrl';

export default class RegionDefaultList extends GenericList<RegionListStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance('region', new RegionGraphQLDatasource(), RegionListStore),
      ...props,
    });
  }

  onEditClick = (id: number | string) => {
    historyPush('region_edit', { id, inModal: true, showSave: true });
  };

  onNewClick = () => {
    historyPush('region_new', { inModal: true, showSave: true });
  };
}
