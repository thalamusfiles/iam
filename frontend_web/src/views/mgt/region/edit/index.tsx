import { TargetForm } from '../../../../commons/plugin.component';
import GenericEdit from '../../../generic/edit';
import ctrlInstance from '../../../generic/edit/ctrl';
import { RegionEditStore } from './ctrl';

export * from './components/about';

export default class RegionEdit extends GenericEdit<RegionEditStore> {
  constructor(props: any) {
    super({
      ctrl: ctrlInstance(TargetForm.region_edit, RegionEditStore),
      ...props,
    });
  }
}
