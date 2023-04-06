import { useEffect } from 'react';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { RoleListStore } from './ctrl';

const RoleDefaultList: React.FC = () => {
  const ctrl = new RoleListStore();

  useEffect(() => {
    ctrl.build();
  });

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default RoleDefaultList;
