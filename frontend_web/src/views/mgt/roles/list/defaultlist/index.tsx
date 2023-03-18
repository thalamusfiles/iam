import { historyPush } from '../../../../../commons/route';
import { RoleGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { RoleListStore } from './ctrl';

const RoleDefaultList: React.FC<{}> = () => {
  const ctrl = ctrlInstance('role', new RoleGraphQLDatasource(), RoleListStore);

  ctrl.newCallback = () => {
    historyPush('role_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('role_edit', { id, inModal: true, showSave: true });
  };

  return <GenericList ctrl={ctrl} />;
};

export default RoleDefaultList;
