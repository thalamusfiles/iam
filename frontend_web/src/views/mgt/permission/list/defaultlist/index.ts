import { historyPush } from '../../../../../commons/route';
import { PermissionGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { PermissionListStore } from './ctrl';

export default class PermissionDefaultList extends GenericList<PermissionListStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance('permission', new PermissionGraphQLDatasource(), PermissionListStore),
      ...props,
    });
  }

  onEditClick = (id: number | string) => {
    historyPush('permission_edit', { id, inModal: true, showSave: true });
  };

  onNewClick = () => {
    historyPush('permission_new', { inModal: true, showSave: true });
  };
}
