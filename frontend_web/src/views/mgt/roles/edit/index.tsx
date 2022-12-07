import { TargetForm } from '../../../../commons/plugin.component';
import GenericEdit from '../../../generic/edit';
import ctrlInstance from '../../../generic/edit/ctrl';
import { RoleEditStore } from './ctrl';

export * from './components/about';
export * from './components/permissions';

export default class RoleEdit extends GenericEdit<RoleEditStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance(TargetForm.role_edit, RoleEditStore),
      ...props,
    });
  }
}
