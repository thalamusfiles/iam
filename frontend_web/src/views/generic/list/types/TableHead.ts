import { AttributeType } from '../../../../commons/attribute-type';

export type ColumnSeparator = 'separator';
export const TableHeadSeparator = 'separator';

export interface TableHead {
  colname: string;
  type: AttributeType | ColumnSeparator;
  title: string;
  order?: number;
  colored?: boolean;
  sortable?: boolean;
  show?: boolean;
  args?: any;
  //Customizavel
  maxWidth?: number;
}
