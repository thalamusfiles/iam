import { historyPush } from '../../../../../commons/route';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { PersonListStore } from './ctrl';

const PersonDefaultList: React.FC = () => {
  const ctrl = new PersonListStore();

  ctrl.newCallback = () => {
    historyPush('person_new');
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('person_edit', { id });
  };

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default PersonDefaultList;
