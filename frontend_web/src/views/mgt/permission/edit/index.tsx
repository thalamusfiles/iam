import { TargetForm } from '../../../../commons/plugin.component';
import GenericEdit from '../../../generic/edit';
import ctrlInstance from '../../../generic/edit/ctrl';
import { PermissionEditStore } from './ctrl';

export * from './components/about';

export default class PermissionEdit extends GenericEdit<PermissionEditStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance(TargetForm.permission_edit, PermissionEditStore),
      ...props,
    });
  }
}
