import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { RoleEditStore } from './ctrl';

export * from './components/about';
export * from './components/permissions';

const RoleEdit: React.FC = () => {
  const ctrl = new RoleEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default RoleEdit;
