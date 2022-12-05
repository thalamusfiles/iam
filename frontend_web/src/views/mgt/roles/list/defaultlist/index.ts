import { historyPush } from '../../../../../commons/route';
import { RoleGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { RoleListStore } from './ctrl';

export default class RoleDefaultList extends GenericList<RoleListStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance('role', new RoleGraphQLDatasource(), RoleListStore),
      ...props,
    });
  }

  onEditClick = (id: number | string) => {
    historyPush('role_edit', { id, inModal: true, showSave: true });
  };

  onNewClick = () => {
    historyPush('role_new', { inModal: true, showSave: true });
  };
}
