import { useParams } from 'react-router-dom';
import GenericEdit, { GenericEditProps } from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { RoleEditStore } from './ctrl';

export * from './components/about';
export * from './components/permissions';

const RoleEdit: React.FC<GenericEditProps> = (props) => {
  const ctrl = new RoleEditStore();
  const { uuid } = useParams();

  ctrl.afterBuild = async () => {
    ctrl.loadPermissions();
    if (uuid) {
      ctrl.loadContent(uuid);
    }
  };

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit inModal={props.inModal} />
    </CommonEditContextProvider>
  );
};

export default RoleEdit;
