import { useEffect } from 'react';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { ApplicationListStore } from './ctrl';

const ApplicationDefaultList: React.FC = () => {
  const ctrl = new ApplicationListStore();

  useEffect(() => {
    ctrl.build();
  });

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default ApplicationDefaultList;
