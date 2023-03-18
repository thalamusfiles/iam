import { historyPush } from '../../../../../commons/route';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { ApplicationListStore } from './ctrl';

const ApplicationDefaultList: React.FC = () => {
  const ctrl = new ApplicationListStore();

  ctrl.newCallback = () => {
    historyPush('application_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('application_edit', { id, inModal: true, showSave: true });
  };

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default ApplicationDefaultList;
