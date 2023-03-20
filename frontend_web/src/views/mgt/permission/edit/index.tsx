import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { PermissionEditStore } from './ctrl';

export * from './components/about';

const PermissionEdit: React.FC = () => {
  const ctrl = new PermissionEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default PermissionEdit;
