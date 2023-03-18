import { historyPush } from '../../../../../commons/route';
import { RegionGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { RegionListStore } from './ctrl';

const RegionDefaultList: React.FC<{}> = () => {
  const ctrl = ctrlInstance('region', new RegionGraphQLDatasource(), RegionListStore);

  ctrl.newCallback = () => {
    historyPush('region_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('region_edit', { id, inModal: true, showSave: true });
  };

  return <GenericList ctrl={ctrl} />;
};

export default RegionDefaultList;
