import { useParams } from 'react-router-dom';
import GenericEdit, { GenericEditProps } from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { UserEditStore } from './ctrl';

export * from './components/about';
export * from './components/authorization';
export * from './components/permissions';
export * from './components/profiles';
export * from './components/applications';

const UserEdit: React.FC<GenericEditProps> = (props) => {
  const ctrl = new UserEditStore();
  const { uuid } = useParams();

  ctrl.afterBuild = async () => {
    ctrl.loadRoles();
    ctrl.loadApplications();
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

export default UserEdit;
