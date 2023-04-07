import { useEffect } from 'react';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { PermissionListStore } from './ctrl';

const PermissionDefaultList: React.FC = () => {
  const ctrl = new PermissionListStore();

  useEffect(() => {
    ctrl.build();
  });

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default PermissionDefaultList;
