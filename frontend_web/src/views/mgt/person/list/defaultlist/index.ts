import { historyPush } from '../../../../../commons/route';
import { PersonGraphQLDatasource } from '../../../../../datasources/apigraphql';
import GenericList from '../../../../generic/list';
import ctrlInstance from '../../../../generic/list/ctrl';
import { PersonListStore } from './ctrl';

export default class PersonDefaultList extends GenericList<PersonListStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance('person', new PersonGraphQLDatasource(), PersonListStore),
      ...props,
    });
  }

  onEditClick = (id: number | string) => {
    historyPush('person_edit', { id });
  };

  onNewClick = () => {
    historyPush('person_new');
  };
}
