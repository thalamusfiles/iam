import { historyPush } from '../../../../../commons/route';
import { ApplicationGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { ApplicationListStore } from './ctrl';

const ApplicationDefaultList: React.FC<{}> = () => {
  const ctrl = ctrlInstance('application', new ApplicationGraphQLDatasource(), ApplicationListStore);

  ctrl.newCallback = () => {
    historyPush('application_new', { inModal: true, showSave: true });
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('application_edit', { id, inModal: true, showSave: true });
  };

  return <GenericList ctrl={ctrl} />;
};

export default ApplicationDefaultList;
