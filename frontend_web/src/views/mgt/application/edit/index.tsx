import { useParams } from 'react-router-dom';
import GenericEdit, { GenericEditProps } from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { ApplicationEditStore } from './ctrl';

export * from './components/about';
export * from './components/managers';

const ApplicationEdit: React.FC<GenericEditProps> = (props) => {
  const ctrl = new ApplicationEditStore();
  const { uuid } = useParams();

  ctrl.afterBuild = async () => {
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

export default ApplicationEdit;
