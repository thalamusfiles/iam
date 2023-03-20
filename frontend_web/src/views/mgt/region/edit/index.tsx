import GenericEdit from '../../../generic/edit';
import { CommonEditContextProvider } from '../../../generic/edit/ctrl';
import { RegionEditStore } from './ctrl';

export * from './components/about';
export * from './components/applications';

const RegionEdit: React.FC = () => {
  const ctrl = new RegionEditStore();

  return (
    <CommonEditContextProvider value={ctrl}>
      <GenericEdit />
    </CommonEditContextProvider>
  );
};

export default RegionEdit;
