import { PartOf } from '../../../commons/types/PartOf';

export type EntityProps<Type> = {
  options?: any;
  entity: PartOf<Type>;
  user: any;
};
