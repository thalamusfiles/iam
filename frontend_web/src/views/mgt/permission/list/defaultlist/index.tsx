import { historyPush } from '../../../../../commons/route';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { PermissionListStore } from './ctrl';

const PermissionDefaultList: React.FC = () => {
  const ctrl = new PermissionListStore();

  ctrl.newCallback = () => {
    historyPush('permission_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('permission_edit', { id, inModal: true, showSave: true });
  };

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default PermissionDefaultList;
