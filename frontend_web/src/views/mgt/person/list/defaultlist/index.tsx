import { historyPush } from '../../../../../commons/route';
import { PersonGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { PersonListStore } from './ctrl';

const PersonDefaultList: React.FC<{}> = () => {
  const ctrl = ctrlInstance('person', new PersonGraphQLDatasource(), PersonListStore);

  ctrl.newCallback = () => {
    historyPush('person_new');
  };

  ctrl.editCallback = (id: number | string) => {
    historyPush('person_edit', { id });
  };

  return <GenericList ctrl={ctrl} />;
};

export default PersonDefaultList;
