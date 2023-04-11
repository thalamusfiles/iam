import { default as axios, default as Axios } from 'axios';
import { action, computed, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { AttributeType } from '../../../commons/attribute-type';
import { defaultPageSize, localStorageDef } from '../../../commons/consts';
import { SortOrder } from '../../../commons/enums/sort-order.enum';
import { formatBoolean, formatDate, formatDatetime, formatDecimal, formatInteger, formatTime } from '../../../commons/formatters';
import { historySearch, historySearchReplace } from '../../../commons/route';
import Storage from '../../../commons/storage';
import { flatFromPath } from '../../../commons/tools';
import { PartOf } from '../../../commons/types/PartOf';
import { WmsFormEvent } from '../../../components/Form';
import { notify } from '../../../components/Notification';
import { FilterDef } from './types/FilterDef';
import type { ListDefinition } from './types/ListDefinition';
import { TableCell, TableCellInfo } from './types/TableCellInfo';
import { TableHead } from './types/TableHead';

/**
 * Configurações para inicialização da listagem
 */
type CommonListStoreOptions = {
  autoSearch?: boolean; //Realizar busca ao carregar
  replaceSearch?: boolean; //Alterar url com os filtros utilizados
};

export class CommonListCtx {
  constructor(makeObs = true) {
    //Modifica classe pra ser observável
    makeObservable(this);
  }

  //Definições dos filtros
  @observable filtersDefs: (FilterDef & { fixed?: boolean })[] = [];
  //Filtros aplicados na listagem
  @observable filtersApplied: (FilterDef & { fixed?: boolean })[] = [];

  //Todos as possíveis colunas passíveis de serem exibidas na listagem
  @observable columnsDefs: TableHead[] = [];
  //Cabeçalho da listagem exibidos
  @observable columns: TableHead[] = [];

  //Todas as colunas ordenáveis
  @computed get sortableHeader() {
    return this.columnsDefs.filter((head) => head.sortable || head.sortable === undefined);
  }
  //Informação da listagem
  @observable sort: TableHead | null = null;
  //Informação da listagem
  @observable sortOrder: SortOrder = SortOrder.Desc;
  //Página
  @observable page: number = 1;
  perPage: number = defaultPageSize;

  //Listagem (matrix) de dados processada
  //Uma célula pode ter um conteudo (uma informação);
  //Uma célula pode ter uma lista de conteudos (uma informação oneToMany);
  //Uma célula pode ter uma lista de conteudos agrupados (uma informação oneToMany de 2 colunas agrupadas);
  @observable list: TableCell /*Linhas*/[] /*Celulas*/[] = [];
  //Retorno da listagem de dados do datasource
  response: any[] = [];
  //Função que cancela requisição anterior
  cancelRequestCallback: Function | null = null;

  //Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;

  //Listagem customizadas pelos usuários
  @observable activeListDefs: string = '';
  @observable defaultListDefs: ListDefinition = {} as any;
  @observable customListDefs: ListDefinition[] = [];
  @observable newCustomListDefs: ListDefinition | null = null;
  //Filtros pré definidos exibidos ao abrir a tela de listagem
  @observable fastFilters: FilterDef[] | /*|  FilterDef[][]*/ undefined;

  @observable showFilters = false;
  @observable showSort = false;
  @observable showColumns = false;
  @observable showSaveList = false;

  options: CommonListStoreOptions = {
    autoSearch: true,
    replaceSearch: true,
  };

  //callbacks
  newCallback?: () => void;
  editCallback?: (uuid: number | string) => void;
  doubleClickCallback?: (uuid: number | string, cell: TableCell) => void;
  removeCallback?: (uuid: number | string) => void;

  @action toggleShowFilters = (show: boolean | undefined = undefined) => {
    this.showFilters = show === undefined ? !this.showFilters : show;

    if (this.showFilters) this.resetFilters();
  };

  @action toggleShowColumns = (show: boolean | undefined = undefined) => {
    this.showColumns = show === undefined ? !this.showColumns : show;

    if (this.showColumns) this.resetColumns();
  };

  @action toggleShowSort = () => {
    this.showSort = !this.showSort;
  };

  @action toggleShowSaveList = () => {
    this.showSaveList = !this.showSaveList;
    if (!this.showSaveList) {
      this.newCustomListDefs = null;
    }
  };

  /**
   * Coleta as definições da listagem padrão
   * e listagens customizáveis do servidor
   */
  @action
  build = async (options?: CommonListStoreOptions) => {
    try {
      if (options) {
        Object.assign(this.options, options);
      }

      this.filtersDefs = (this.defaultListDefs.filters || []).map((j) => {
        const applied = this.filtersApplied.find((a) => a.name === j.name);
        j.value = applied?.value;
        if (j.value === null) j.value = undefined;
        (j as any).fixed = applied?.fixed;
        return { ...j };
      }); //Criar cópia

      this.columnsDefs = this.defaultListDefs.columns.map((j) => {
        return { ...j };
      }); //Criar cópia

      this.toggleCustomList(this.defaultListDefs, false);
      this.loadFiltersFromUrl();
      this.loadCustomsList();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        notify.danger(err.response?.data?.message, 'An error occurred while loading the settings');
      }
    }
  };

  /**
   * Utilizado quando o componente é destruido
   * Finaliza as conexções em execução
   */
  close = async () => {
    if (this.cancelRequestCallback) this.cancelRequestCallback();
  };

  /**
   * Realiza busca dos dados
   * e monta os dados para serem exeibidos em tela
   */
  @action
  search = async () => {
    this.loading = true;

    //Remove definição de filtros rápido e não os exibe mais em tela
    if (this.fastFilters) this.fastFilters = undefined;

    //Cancela requisição anterior
    if (this.cancelRequestCallback) this.cancelRequestCallback();

    try {
      this.response = await this.execSearch();
      this.formatList(this.response);
    } catch (error) {
      if (!Axios.isCancel(error)) {
        notify.warn('An error occurred while updating the listing.', undefined, JSON.stringify(error));
      }
    }

    this.loading = false;
  };
  // Função chamada quando é solicitado uma nova busca.
  execSearch = async (): Promise<any[]> => {
    return [];
  };

  /**
   * Formata o resultado do DataSouce
   * @param response
   */
  formatList(response: any[]) {
    // Percore cada linha do json e formata
    this.list = response.map((responseRow) => {
      const row: TableCell[] = [];

      for (const head of this.columns) {
        //Célula não agrupada
        row.push(this.makeCellInfo(responseRow, head));
      }

      return row;
    });
  }

  /**
   * Monta a informação de uma única célula
   * @param responseRow
   * @param head
   */
  makeCellInfo(responseRow: any, head: TableHead): TableCellInfo[] {
    const col: TableCellInfo = {
      head: head,
      colname: head.colname.replace('.', '_'),
      description: '',
      value: null,
    };

    const relations = head.colname.split('.');
    let value = flatFromPath(responseRow, relations);
    value = Array.isArray(value) ? value : [value];

    return value.map((j: any) => {
      const colCopy = Object.assign({}, col);
      colCopy.value = j;
      colCopy.description = this.formatAttribute(head, j);
      return colCopy;
    });
  }

  /**
   * Formata o atributo da celula
   * @param attr
   */
  formatAttribute(head: TableHead, value: any): string {
    switch (head.type) {
      case AttributeType.Time:
        return formatTime(value);
      case AttributeType.Date:
        return formatDate(value);
      case AttributeType.DateTime:
        return formatDatetime(value);
      case AttributeType.Decimal:
        return formatDecimal(value);
      case AttributeType.Integer:
        return formatInteger(value);
      case AttributeType.Boolean:
        return formatBoolean(value);
      case AttributeType.Text:
      default:
        return value;
    }
  }

  /**
   * Altera a coluna a ser ordenada
   * e a ordem da listagem
   */
  @action toggleSortOrder = (head: TableHead) => {
    if (!head.sortable && head.sortable !== undefined) {
      notify.info(`${head.title} column not sortable`);
      return;
    }

    if (this.sort?.colname === head.colname) {
      this.sortOrder = this.sortOrder === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
    } else {
      this.sort = head;
    }
    if (this.page > 1) {
      notify.info('Pager changed');
      this.page = 1;
    }

    this.search();
  };

  /**
   * Intercepta todas as alterações dos filtros
   * @param value Valor
   * @param description Valor formatado
   * @param filter Definição do filtro alterado
   * @param idx Posição do filtro alterado da lista de filtros
   * @param e Evento com alteração do filtro
   */
  @action
  filterChange = (value: any | null, description: string | null, filter: FilterDef, idx: number, e: WmsFormEvent) => {
    this.filtersDefs[idx].value = value || (e.target as HTMLInputElement).value;
    this.filtersDefs[idx].description = description || (e.target as HTMLInputElement).value;
  };

  /**
   * Limpa a seleção dos filtros
   */
  @action
  clearFilters = () => {
    return this.filtersDefs.forEach((filter) => {
      filter.value = undefined;
      filter.description = '';
    });
  };

  /**
   * Restaura a ultima listagem de filtros informados
   */
  @action
  resetFilters = () => {
    //Recuperar valores dos filtros utilizados
    this.filtersDefs.forEach((filter) => {
      const filterApplied = this.filtersApplied.find((filterApplied) => filterApplied.name === filter.name);
      if (filterApplied) {
        filter.value = filterApplied.value;
        filter.description = filterApplied.description;
      } else {
        filter.value = undefined;
        filter.description = '';
      }
    });
  };

  /**
   * Adiciona filtro
   * @param filter
   */
  @action
  addFilter = (filter: FilterDef) => {
    //Procura se existe o filtro informado nos filtros pré definidos
    const filterDef = this.filtersDefs.find((j) => j.name === filter.name);
    //Se existe o filtro pre definido, aplica conforme pré definicição
    if (filterDef) {
      filterDef.value = filter.value;
      this.filtersApplied.push(filterDef);
    }

    this.saveFilters();
    this.search();
  };

  /**
   * Aplica os novos filtros informados pelo usuário
   * Cria uma cópia dos filtros
   */
  @action
  applyFilters = (research: boolean | undefined = true, saveFilters: boolean | undefined = true) => {
    this.page = 1;

    this.toggleShowFilters(false);
    this.filtersApplied = this.filtersDefs
      .filter((filter) => filter.value !== undefined) //null deve ser encaminhado com filtro is null
      .map((filter) => {
        return { ...filter };
      });

    if (saveFilters) this.saveFilters();
    if (research) this.search();
  };

  /**
   * remove determinado filtro
   */
  @action
  removeFilter = (filter: FilterDef, idx: number) => {
    if (this.filtersApplied[idx].fixed) {
      notify.info('Filtro fixo.');
      return;
    }
    this.filtersApplied.splice(idx, 1);

    this.search();
  };

  /**
   * Salva os filtros na url
   */
  saveFilters = () => {
    if (this.options.replaceSearch) {
      historySearchReplace(
        this.filtersApplied.reduce((last: any, curr: any) => {
          last[curr.name] = curr.value;
          return last;
        }, {}),
      );
    }
  };

  /**
   * Carrega os filtros da URL da página
   */
  loadFiltersFromUrl = () => {
    let hasFilter = false;
    const urlSearch = historySearch();
    for (const filter of this.filtersDefs) {
      const value = urlSearch[filter.name];
      if (value) {
        filter.value = value;
        hasFilter = true;
      }
    }
    if (hasFilter) {
      this.fastFilters = undefined;
    }
  };

  /**
   * Volta para a página anterior
   */
  @action
  previewsPage = () => {
    if (this.page > 1) {
      this.page--;
      this.search();
    }
  };

  /**
   * Troca para a próxima página
   */
  @action
  nextPage = () => {
    this.page++;

    this.search();
  };

  /**
   * Intercepta todas as alterações dos filtros
   * @param e Evento com alteração do filtro
   * @param filter Definição do filtro alterado
   * @param idx Posição do filtro alterado da lista de filtros
   */
  @action
  columnsChange = (e: any, head: TableHead, idx: number) => {
    this.columnsDefs[idx].show = !this.columnsDefs[idx].show;
  };

  @action
  clearColumns = () => {
    //Recuperar quais colunas estão sendo utilizadas
    this.columnsDefs.forEach((headDef) => {
      headDef.show = headDef.colname === 'id';
    });
  };

  @action
  resetColumns = () => {
    //Recuperar quais colunas estão sendo utilizadas
    this.columnsDefs.forEach((headDef) => {
      const head = this.columns.find((head) => head.colname === headDef.colname);
      if (head) {
        headDef.show = head.show;
      } else {
        headDef.show = false;
      }
    });
  };

  /**
   * Aplica nova configuração de colunas a serem exibidas em tela
   * Cria uma cópia das colunas selecionados
   * e ordena as colunas conforme preferência do usuário
   */
  @action
  applyColumns = (research: boolean | undefined = true) => {
    this.toggleShowColumns(false);
    this.columns = this.columnsDefs
      .filter((filter) => filter.show)
      .map((head) => {
        return { ...head };
      })
      .sort(this.applyColumnsColumnsSorter);

    if (research) this.search();
  };

  /**
   * Função de ordenação das colunas
   * @param l
   * @param r
   */
  applyColumnsColumnsSorter(l: TableHead, r: TableHead) {
    return (l.order || 0) === (r.order || 0) ? 0 : (l.order || Number.MAX_SAFE_INTEGER) < (r.order || Number.MAX_SAFE_INTEGER) ? -1 : 1;
  }

  @computed
  get showAddColumn(): boolean {
    return this.columns.length < this.columnsDefs.length;
  }

  /**
   * Troca uma coluna de posição
   * e a posição das colunas que estão entra a troca
   */
  @action swapHeaderOrder = (drag: TableHead, drop: TableHead) => {
    const orderDrag = drag.order || 0;
    const orderDrop = drop.order || 0;
    const directon = (drag.order || 0) < (drop.order || 0) ? 1 : -1;

    for (let head of this.columns) {
      const order = head.order || 0;
      if (directon > 0 ? order > orderDrag && order < orderDrop /*Crescente*/ : order > orderDrop && order < orderDrag /*Decrescente*/) {
        head.order = (head.order || 0) - directon;
      }
    }

    drag.order = orderDrop;
    drop.order = orderDrop - directon;

    this.columns.sort(this.applyColumnsColumnsSorter);

    this.formatList(this.response);
  };

  /**
   * Altera entre listagens customizadas pelos usuários
   * @param customList
   */
  @action toggleCustomList = (customList: ListDefinition | null, saveFilters: boolean | undefined = true) => {
    if (customList === null) return;

    this.activeListDefs = customList.name;

    this.sort = customList.sort;
    this.sortOrder = customList.sortOrder;
    this.filtersDefs = customList.filters || [];
    this.columnsDefs = customList.columns;

    this.newCustomListDefs = customList;

    this.applyFilters(false, saveFilters);
    this.applyColumns(false);

    this.search();
  };

  /**
   * Clona as informações em tela para a nova listagem
   */
  @action startNewCustomList = () => {
    this.newCustomListDefs = {
      id: '',
      name: '',
      filters: this.filtersDefs,
      columns: this.columnsDefs,
      sort: this.sort,
      sortOrder: this.sortOrder,
    };
  };

  @action assignNewCustomList = (newCustomListDefs: PartOf<ListDefinition>) => {
    this.newCustomListDefs = Object.assign({}, this.newCustomListDefs, newCustomListDefs);
  };

  /**
   * Abre o cadastro da nova listagem
   * ou Salva a listagem
   * @param newCustomListDefs
   * @returns
   */
  @action saveCustomList = (newCustomListDefs: ListDefinition | null = null) => {
    //let isNew = false;
    if (this.activeListDefs !== this.defaultListDefs?.name) {
      newCustomListDefs = this.customListDefs.find((custom) => custom.name === this.activeListDefs) || null;
    } else if (!newCustomListDefs) {
      this.startNewCustomList();
      this.showSaveList = true;
      return false;
    }

    if (newCustomListDefs) {
      this.showSaveList = false;

      // Carrega as listagens customizadas
      const customListDefs = this.loadCustomsList(false);

      // Adiciona o tab à listagens customizadas
      const id = (newCustomListDefs.id = newCustomListDefs.name.replace(/[ |^"'`]/g, '_'));
      customListDefs[id] = newCustomListDefs;

      // Salva a listagem customizada
      Storage.set(localStorageDef.genericListTabs, this.constructor.name, customListDefs);
      this.customListDefs = Object.values(customListDefs);
    }
  };

  /**
   * Carrega um objeto com todas as listagens salvas
   * @returns
   */
  loadCustomsList = (reload: boolean = true): Record<string, ListDefinition> => {
    // Carrega as listagens customizadas
    const ctrlName = this.constructor.name;
    const customListDefs = Storage.get(localStorageDef.genericListTabs, ctrlName, {});

    if (reload) {
      this.customListDefs = Object.values(customListDefs);
    }

    return customListDefs;
  };

  /**
   * Função acionada ao clicar no botão de novo
   */
  onNewClick = () => {
    if (this.newCallback) this.newCallback();
  };

  /**
   * Função acionada ao clicar no botão de editar
   */
  onEditClick = (idx: number) => {
    if (this.editCallback) {
      this.editCallback(this.response[idx].uuid);
    }
  };

  /**
   * Função acionada ao clicar no botão de editar
   */
  onDoubleClick = (yindex: number, cell: TableCell) => {
    if (this.doubleClickCallback) {
      this.doubleClickCallback(this.response[yindex].uuid, cell);
    }
  };

  /**
   * Função acionada ao clicar no botão de remover
   */
  onRemoveClick = (yindex: number) => {
    if (this.removeCallback) {
      this.removeCallback(this.response[yindex].uuid);
    }
  };
}

export const CommonListContext = createContext<CommonListCtx>({} as CommonListCtx);
export const CommonListContextProvider = CommonListContext.Provider;
export const useCommonListStore = (): CommonListCtx => useContext(CommonListContext);
