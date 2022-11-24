import Axios, { AxiosResponse, Canceler } from 'axios';
import { AttributeType } from '../../commons/attribute-type';
import { SortOrder } from '../../commons/enums/sort-order.enum';
import { FilterDef } from '../../views/generic/list/types/FilterDef';
import { TableHead } from '../../views/generic/list/types/TableHead';
import { ApiGraphQL } from '../apis';

type GraphQLNode = {
  name: string;
  args?: any;
  children: GraphQLNode[];
};

export interface GraphQLInterface {
  baseQuery: string;
  //Retorna listagem com chave e valor das colunas.
  exec(
    filtersApplied: FilterDef[],
    header: TableHead[],
    page: number,
    perPage: number | null,
    sortBy: TableHead | null,
    sortOrder: SortOrder,
    cancelTokenCallback: (cancel: Canceler) => void,
  ): Promise<any>;
}

export abstract class GraphQLDatasource implements GraphQLInterface {
  baseQuery: string;

  constructor(baseQuery: string) {
    this.baseQuery = baseQuery;
  }

  /**
   * Realiza a busca no graphql
   * @param filtersApplied Filtros informados, considerar todos os filtros recebidos.
   * @param header colunas que serão exibidas na listagem.
   * @param page página da listagem.
   * @param perPage quantidade de items por página.
   * @param sortBy coluna que determina a ordenação da listagem.
   * @param sortOrder ordem da listagem (ascendente ou descendente).
   * @param cancelTokenCallback retorna função que cancela requisição
   */
  exec(
    filtersApplied: FilterDef[],
    header: TableHead[],
    page: number,
    perPage: number | null,
    sortBy: TableHead | null,
    sortOrder: SortOrder,
    cancelTokenCallback?: (cancel: Canceler) => void,
  ) {
    if (!this.baseQuery) {
      //Todo Criar exceções globais
      throw new Error('Query Param Not Defined');
    }

    const filters: FilterDef[] = filtersApplied.concat([]);
    const options: FilterDef[] = [];
    const stringType = [AttributeType.Text, AttributeType.Date, AttributeType.DateTime, AttributeType.Time];

    //Adiciona filtro de paginação
    if (page !== null) {
      const pageFilter: FilterDef = {
        type: AttributeType.Integer,
        name: 'page', //Todo: Criar constante,
        title: '',
        value: page,
      };

      options.push(pageFilter);
    }

    //Adiciona filtro de ordenação
    if (sortBy !== null) {
      const sortFilter: FilterDef = {
        type: AttributeType.Text,
        name: 'sortBy', //Todo: Criar constante,
        title: '',
        value: sortBy.colname,
      };
      options.push(sortFilter);

      const orderFilter: FilterDef = {
        type: AttributeType.Text,
        name: 'sortOrder', //Todo: Criar constante,
        title: '',
        value: sortOrder === SortOrder.Down ? 'desc' : 'asc',
      };
      options.push(orderFilter);
    }

    let queryOptions = '';
    if (filters.length) {
      const where = filters
        .map((x) => {
          if (Array.isArray(x.value)) {
            return `${x.name}: ${stringType.includes(x.type) ? `["${x.value.join(`", "`)}"]` : `[${x.value}]`}`;
          } else {
            return `${x.name}: ${stringType.includes(x.type) ? `"${x.value}"` : x.value}`;
          }
        })
        .join(', ');

      queryOptions += `where: {${where}}`;
    }
    if (options.length) {
      queryOptions += options.map((x) => `${x.name}: ${stringType.includes(x.type) ? `"${x.value}"` : x.value}`).join(', ');
    }
    if (queryOptions) queryOptions = `(${queryOptions})`;

    //Constroi da árvore de relações
    const graphQlRelationTreeRoot: GraphQLNode = this.makeTree(header);
    //Converte arove de relações em graphql query
    let query = this.treeToString(graphQlRelationTreeRoot);
    //Adiciona filtros, ordenação e paginção á query.
    query = query.replace(/{/, queryOptions + '{');

    return ApiGraphQL.post<any>(
      '',
      { query: `{${query}}` },
      { cancelToken: cancelTokenCallback ? new Axios.CancelToken(cancelTokenCallback) : undefined },
    ).then((response: AxiosResponse<any>) => {
      if (response.data.errors) {
        throw response.data.errors;
      }
      const graphqlData = response.data.data;
      const [firstElement] = Object.keys(graphqlData);

      return graphqlData[firstElement] ?? [];
    });
  }

  private makeTree(header: TableHead[]): GraphQLNode {
    const root: GraphQLNode = { name: this.baseQuery, children: [] };

    for (const head of header) {
      let node: GraphQLNode = root;
      const path = head.colname.split('.');
      for (const field of path) {
        let newNode = node.children.find((e) => e.name === field);
        if (!newNode) {
          newNode = { name: field, children: [] };
          node.children.push(newNode);
        }
        node = newNode;
      }
      node.args = head.args;
    }

    return root;
  }

  private treeToString(node: GraphQLNode, text: string = ''): string {
    if (node.args) {
      let args = '';
      for (const key in node.args) {
        args += `${key} : ${node.args[key]}, `;
      }
      text += `${node.name} (${args})`;
    } else {
      text += node.name;
    }
    if (node.children.length !== 0) {
      text += '{';
      node.children.forEach((child) => {
        text += this.treeToString(child);
      });
      text += '}, ';
    } else {
      text += ', ';
    }
    return text;
  }
}
