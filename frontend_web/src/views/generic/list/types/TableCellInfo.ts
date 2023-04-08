import { TableHead } from './TableHead';

export interface TableCellInfo {
  head: TableHead;
  colname: string;
  value: any | null;
  description: string;
  colorName?: string;
}

export type TableCell = TableCellInfo[];
