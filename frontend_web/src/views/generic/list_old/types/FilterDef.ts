import { AttributeType } from '../../../../commons/attribute-type';

/**
 * Definição do tipo de filtro
 */

export interface FilterDef {
  type: AttributeType; //Tipo de campo
  name: string; //Coluna que o filtro usará como base
  title: string; //Título para exibição
  value?: any; //Valor do filtro
  description?: string; //Descrição do filtro
}
