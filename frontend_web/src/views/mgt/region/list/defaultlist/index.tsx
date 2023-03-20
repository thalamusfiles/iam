import { historyPush } from '../../../../../commons/route';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { RegionListStore } from './ctrl';

const RegionDefaultList: React.FC = () => {
  const ctrl = new RegionListStore();

  ctrl.newCallback = () => {
    historyPush('region_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('region_edit', { id, inModal: true, showSave: true });
  };

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default RegionDefaultList;