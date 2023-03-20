import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { PersonEditStore } from './ctrl';

export * from './components/about';
export * from './components/authorization';
export * from './components/permissions';
export * from './components/profiles';

const PersonEdit: React.FC = () => {
  const ctrl = new PersonEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default PersonEdit;
