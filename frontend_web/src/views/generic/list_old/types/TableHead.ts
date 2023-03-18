import { AttributeType } from '../../../../commons/attribute-type';

export type ColumnSeparator = 'separator';
export const TableHeadSeparator = 'separator';

export interface TableHead /*WmsFieldMetadata*/ {
  colname: string;
  type: AttributeType | ColumnSeparator | TableHead[];
  title: string;
  order?: number;
  colored?: boolean;
  sortable?: boolean;
  show?: boolean;
  args?: any;
  //Customizavel
  maxWidth?: number;
}
