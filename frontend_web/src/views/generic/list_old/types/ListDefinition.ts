import { SortOrder } from '../../../../commons/enums/sort-order.enum';
import { FilterDef } from './FilterDef';
import { TableHead } from './TableHead';

/**
 * Definição da listagem:
 *   Título da listagem
 *   Filtros
 *   Colunas
 *   Ordem
 */

export interface ListDefinition {
  id: string;
  name: string;
  filters?: FilterDef[];
  columns: TableHead[];
  sort: TableHead | null;
  sortOrder: SortOrder;
}
