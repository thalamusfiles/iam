import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { ApplicationEditStore } from './ctrl';

export * from './components/about';

const ApplicationDefaultList: React.FC = () => {
  const ctrl = new ApplicationEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default ApplicationDefaultList;
