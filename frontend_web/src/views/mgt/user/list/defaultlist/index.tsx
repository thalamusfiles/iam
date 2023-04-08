import { useEffect } from 'react';
import GenericList from '../../../../generic/list';
import { CommonListContextProvider } from '../../../../generic/list/ctrl';
import { UserListStore } from './ctrl';

const UserDefaultList: React.FC = () => {
  const ctrl = new UserListStore();

  useEffect(() => {
    ctrl.build();
  });

  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};

export default UserDefaultList;
