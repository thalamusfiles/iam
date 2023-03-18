import { historyPush } from '../../../../../commons/route';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { RoleListStore } from './ctrl';

const RoleDefaultList: React.FC = () => {
  const ctrl = new RoleListStore();

  ctrl.newCallback = () => {
    historyPush('role_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('role_edit', { id, inModal: true, showSave: true });
  };

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default RoleDefaultList;
