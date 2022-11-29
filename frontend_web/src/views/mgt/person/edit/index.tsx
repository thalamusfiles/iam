import { TargetForm } from '../../../../commons/plugin.component';
import GenericEdit from '../../../generic/edit';
import ctrlInstance from '../../../generic/edit/ctrl';
import { PersonEditStore } from './ctrl';

export * from './components/about';
export * from './components/authorization';
export * from './components/permissions';
export * from './components/profiles';

export default class PersonEdit extends GenericEdit<PersonEditStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance(TargetForm.person_edit, PersonEditStore),
      ...props,
    });
  }
}
