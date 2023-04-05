import { Canceler } from 'axios';
import { mount, shallow } from 'enzyme';
import GenericList from '.';
import { AttributeType } from '../../../commons/attribute-type';
import { SortOrder } from '../../../commons/enums/sort-order.enum';
import { CommonListContextProvider, CommonListCtx } from './ctrl';
import { FilterDef } from './types/FilterDef';
import { ListDefinition } from './types/ListDefinition';
import { TableHead } from './types/TableHead';

describe('GenericList', () => {
  beforeAll(async () => {});

  it('Renderiza corretamente?', () => {
    const component = shallow(<TestGenericList />);

    expect(component).toMatchSnapshot();
  });

  it('Exibi modal com filtros e troca os filtros?', async () => {
    let ctrl: CommonListCtx;
    const component = mount(<TestGenericList />);

    await ctrl!.search();
    expect(ctrl!.filtersDefs).toHaveLength(customListDef?.filters?.length || 0);

    //Teste botão de exibir modal de filtros
    expect(ctrl!.showFilters).toBeFalsy();
    component.find('div#tg_filters').simulate('click');
    expect(ctrl!.showFilters).toBeTruthy();

    //Altera os filtros
    changeInputValue(component.find(`input[name="${filterID.name}"]`), '1');
    changeInputValue(component.find(`input[name="${filterName.name}"]`), 'Name');

    //Verifica se os filtros foram alterados depois de clicar no botão aplicar filtros
    expect(ctrl!.filtersApplied).toHaveLength(0);
    ctrl!.applyFilters();
    expect(ctrl!.filtersApplied).toHaveLength(customListDef?.filters?.length || 0);
    expect(ctrl!.filtersApplied[0]).toHaveProperty('value', 1);
    expect(ctrl!.filtersApplied[1]).toHaveProperty('value', 'Name');
  });

  it('Exibi modal de colunas e altera colunas visíveis?', async () => {
    let ctrl: CommonListCtx;
    const component = mount(<TestGenericList />);

    expect(ctrl!.columnsDefs).toHaveLength(customListDef.columns.length);

    //Teste botão de exibir modal de coluna
    expect(ctrl!.showColumns).toBeFalsy();
    component.find('div#tg_columns').simulate('click');
    expect(ctrl!.showColumns).toBeTruthy();

    ////Verifica a quantidade de itens checkados(colunas ativas)
    //const columnSize = customListDef.columns.filter((filter) => filter.checked).length;
    //expect(ctrl!.columns).toHaveLength(columnSize);
    ////Simula clique para checkar as colunas que não estão selecionadas
    //for (const head of customListDef.columns.filter((filter) => !filter.checked)) {
    //  simulateInputClick(component.find(`input[name="${head.colname}"]`));
    //}
    //Aplicar a seleção de colunas
    ctrl!.applyColumns();
    //Verifica a quantidade de colunas checkadas
    expect(ctrl!.columns).toHaveLength(customListDef.columns.length);
    //Verifica se o modal de exibição de colunas foi escondido
    expect(ctrl!.showColumns).toBeFalsy();

    //Manda exibir a listagem novamente
    component.find('div#tg_columns').simulate('click');

    //Desmarcar todos os campos checkados
    for (const head of ctrl!.columns) {
      simulateInputClick(component.find(`input[name="${head.colname}"]`));
    }
    //Aplicar a seleção de colunas
    ctrl!.applyColumns();
    expect(ctrl!.columns).toHaveLength(0);
  });

  it('Exibi modal de ordenação e altera ordenação?', () => {
    let ctrl: CommonListCtx;
    const component = mount(<TestGenericList />);

    //Teste botão de exibir modal de ordenação
    expect(ctrl!.showSort).toBeFalsy();
    component.find('div#tg_sort').simulate('click');
    expect(ctrl!.showSort).toBeTruthy();

    //Troca para o filtro name
    simulateInputClick(component.find(`input[name="sort"][value="${tableNameHead.colname}"]`));
    expect(ctrl!.sort?.colname).toEqual(tableNameHead.colname);

    //Troca para o filtro protocolo
    simulateInputClick(component.find(`input[name="sort"][value="${tableProtocolHead.colname}"]`));
    expect(ctrl!.sort?.colname).toEqual(tableProtocolHead.colname);
    expect(ctrl!.sortOrder).toEqual(SortOrder.Desc);

    //Troca a ordem do filtro
    simulateInputClick(component.find(`input[name="sort"][value="${tableProtocolHead.colname}"]`));
    expect(ctrl!.sort?.colname).toEqual(tableProtocolHead.colname);
    expect(ctrl!.sortOrder).toEqual(SortOrder.Asc);
  });

  //it('Exibe conteúdo da listagem?', async () => {
  //  let ctrl: CommonListCtx;
  //  mount(<TestGenericList />);
  //  const columnSize = customListDef.columns.filter((filter) => filter.checked).length;
  //
  //  await ctrl!.search();
  //  expect(ctrl!.response).toHaveLength(listSize);
  //  expect(ctrl!.list).toHaveLength(listSize);
  //  expect(ctrl!.list[0]).toHaveLength(columnSize);
  //});

  it('Troca para próxima página e página anterior?', async () => {
    let ctrl: CommonListCtx;
    const component = mount(<TestGenericList />);

    await ctrl!.search();
    expect(ctrl!.page).toEqual(1);

    //Troca para a próxima página
    simulateInputClick(component.find(`a#next_page`));
    expect(ctrl!.page).toEqual(2);

    //Troca para a página anterior
    simulateInputClick(component.find(`a#previews_page`));
    expect(ctrl!.page).toEqual(1);
    //Verifica se o campo foi desabilitado
    expect(component.find(`span#previews_page`).props()).toHaveProperty('disabled');
  });
});

function changeInputValue(component: any, value: string) {
  const mock = { target: { value: value } };
  component.simulate('change', mock);
}
function simulateInputClick(component: any) {
  component.simulate('click');
}

/**
 * Valores utilizados no mock
 */
const listSize = 10;
const filterID: FilterDef = { type: AttributeType.Integer, name: 'id', title: '#' };
const filterName: FilterDef = { type: AttributeType.Integer, name: 'name', title: 'Name' };

let order = 1;
const tableIDHead: TableHead = { colname: 'id', title: 'id', type: AttributeType.Integer, order: order++, sortable: true, show: true };
const tableNameHead: TableHead = { colname: 'name', title: 'name', type: AttributeType.Text, order: order++, sortable: true, show: true };
const tableProtocolHead: TableHead = {
  colname: 'protocol',
  title: 'protocol',
  type: AttributeType.Text,
  order: order++,
  sortable: true,
  show: false,
};
const tableCreatedAtHead: TableHead = {
  colname: 'createAt',
  title: 'Created At',
  type: AttributeType.DateTime,
  order: order++,
  sortable: true,
  show: false,
};

const customListDef: ListDefinition = {
  id: 'default',
  name: 'default',
  filters: [filterID, filterName],
  columns: [tableIDHead, tableNameHead, tableProtocolHead, tableCreatedAtHead],
  sort: tableNameHead,
  sortOrder: SortOrder.Asc,
};

/**
 * Mock data source teste
 */
class TestGraphQLDatasourceMock {
  baseQuery: string = '/';

  //Retorna listagem com chave e valor das colunas.
  exec(
    filtersApplied: FilterDef[],
    header: TableHead[],
    page: number,
    perPage: number | null,
    sortBy: TableHead | null,
    sortOrder: SortOrder,
    cancelTokenCallback: (cancel: Canceler) => void,
  ): Promise<any> {
    let id = 0;
    let result = [];
    for (let j = 0; j < listSize; j++) {
      result.push({ id: ++id, name: `Name ${id}`, protocol: `Protocol ${id}`, createAt: new Date() });
    }
    return Promise.resolve(result);
  }
}

/**
 * Listagem Generica
 */

const TestGenericList: React.FC = () => {
  const ctrl = new CommonListCtx();
  return (
    <CommonListContextProvider value={ctrl}>
      <GenericList />
    </CommonListContextProvider>
  );
};
