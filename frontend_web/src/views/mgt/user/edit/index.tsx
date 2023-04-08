import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { UserEditStore } from './ctrl';

export * from './components/about';
export * from './components/authorization';
export * from './components/permissions';
export * from './components/profiles';

const UserEdit: React.FC = () => {
  const ctrl = new UserEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default UserEdit;
