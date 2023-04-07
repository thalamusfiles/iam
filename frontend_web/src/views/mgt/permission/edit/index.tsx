import { useParams } from 'react-router-dom';
import GenericEdit, { GenericEditProps } from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { PermissionEditStore } from './ctrl';

export * from './components/about';
export * from './components/roles';

const PermissionEdit: React.FC<GenericEditProps> = (props) => {
  const ctrl = new PermissionEditStore();
  const { uuid } = useParams();

  ctrl.afterBuild = async () => {
    if (uuid) {
      ctrl.loadRoles(uuid);
      ctrl.loadContent(uuid);
    }
  };

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit inModal={props.inModal} />
    </CommonEditContextProvider>
  );
};

export default PermissionEdit;
