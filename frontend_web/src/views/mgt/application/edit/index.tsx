import { TargetForm } from '../../../../commons/plugin.component';
import GenericEdit from '../../../generic/edit';
import ctrlInstance from '../../../generic/edit/ctrl';
import { ApplicationEditStore } from './ctrl';

export * from './components/about';

export default class ApplicationEdit extends GenericEdit<ApplicationEditStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance(TargetForm.application_edit, ApplicationEditStore),
      ...props,
    });
  }
}
