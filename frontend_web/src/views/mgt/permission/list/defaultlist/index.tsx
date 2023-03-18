import { historyPush } from '../../../../../commons/route';
import { PermissionGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { PermissionListStore } from './ctrl';

const PermissionDefaultList: React.FC<{}> = () => {
  const ctrl = ctrlInstance('permission', new PermissionGraphQLDatasource(), PermissionListStore);

  ctrl.newCallback = () => {
    historyPush('permission_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('permission_edit', { id, inModal: true, showSave: true });
  };

  return <GenericList ctrl={ctrl} />;
};

export default PermissionDefaultList;
