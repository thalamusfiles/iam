import { historyPush } from '../../../../../commons/route';
import { ApplicationGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { ApplicationListStore } from './ctrl';

export default class ApplicationDefaultList extends GenericList<ApplicationListStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance('application', new ApplicationGraphQLDatasource(), ApplicationListStore),
      ...props,
    });
  }

  onEditClick = (id: number | string) => {
    historyPush('application_edit', { id, inModal: true, showSave: true });
  };

  onNewClick = () => {
    historyPush('application_new', { inModal: true, showSave: true });
  };
}
