import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import { IconsDef } from '../../../commons/consts';
import { SortOrder } from '../../../commons/enums/sort-order.enum';
import { WMSI18N } from '../../../commons/i18';
import Loader from '../../../components/Loader';
import { ColumnsModal } from './columns-modal';
import { CommonListStore } from './ctrl';
import { FastFilters, FiltersModal, FiltersResume } from './filters-modal';
import { SortListModal } from './save-list-modal';
import { SortModal } from './sort-modal';
import { TableResizer } from './table-resizer';
import { TableCell, TableCellInfo } from "./types/TableCellInfo";
import { TableGroupCellInfo } from "./types/TableGroupCellInfo";
import { TableHead } from "./types/TableHead";

type GenericListProps<S extends CommonListStore> = {
  ctrl?: S;
  ctrlRef?: (ctrl: S) => void;
};

export default abstract class GenericList<S extends CommonListStore> extends React.Component<GenericListProps<S>> {
  ctrl: S;

  constructor(props: any) {
    super(props);

    this.ctrl = props.ctrl;
    if (props.ctrlRef) {
      props.ctrlRef(this.ctrl);
    }
  }

  componentDidMount() {
    this.ctrl.newCallback = this.onNewClick;
    this.ctrl.editCallback = this.onEditClick;
    this.ctrl.doubleClickCallback = this.onDoubleClick;

    this.ctrl.build();
  }

  componentWillUnmount() {
    this.ctrl.close();
  }

  /**
   * Função acionada ao clicar no botão de novo
   */
  onNewClick?: () => void;
  /**
   * Função acionada ao clicar no botão de editar
   */
  onEditClick?: (id: number | string) => void;
  /**
   * Função acionada ao clicar duas vezes na célula
   */
  onDoubleClick?: (id: number | string, cell: TableCell) => void;

  render() {
    return (
      <Provider ctrl={this.ctrl}>
        <div className="zi1">
          <TopTabsBar />
          <FunctionsTabBar />
        </div>
        <List />
        <FastFilters />
      </Provider>
    );
  }
}

@WMSI18N()
@inject('ctrl')
@observer
class List extends React.Component<{ ctrl?: CommonListStore; __?: Function }> {
  drapHead: TableHead | null = null;

  onDragStart = (head: TableHead) => {
    this.drapHead = head;
  };

  onDragOver = (e: any) => {
    e.preventDefault();
  };

  onDrop = (head: TableHead) => {
    const { ctrl } = this.props;

    if (this.drapHead) {
      ctrl!.swapHeaderOrder(this.drapHead, head);
      this.drapHead = null;
    }
  };

  render() {
    const { __, ctrl } = this.props;

    if (ctrl!.fastFilters) return null;

    let content;
    if (ctrl!.defaultListDefs === null || !ctrl!.columns.length) {
      content = (
        <Table hover size="sm">
          <tbody>
            <tr>
              <td>{__!('msg.loadingsettings')}</td>
            </tr>
          </tbody>
        </Table>
      );
    } else {
      content = (
        <Table className="table-resizable" hover size="sm" bordered>
          <thead className="bg-light">
            <tr>
              <th></th>
              {ctrl!.columns.map((head, idx) => (
                <th className="pointer nowrap" style={{ width: head.maxWidth, maxWidth: head.maxWidth }} key={idx}>
                  <TableResizer head={head} />
                  <div
                    //Toggle Sort Order
                    onClick={() => ctrl!.toggleSortOrder(head)}
                    key={head.colname}
                    //Drag and Drop Controls
                    draggable={true}
                    onDragStart={() => this.onDragStart(head)}
                    onDragOver={this.onDragOver}
                    onDrop={() => this.onDrop(head)}
                  >
                    {head.title} {/* ilustração da ordem da listagem*/}
                    {head.sortable &&
                      ctrl!.sort?.colname === head.colname &&
                      (ctrl!.sortOrder === SortOrder.Down ? (
                        <FontAwesomeIcon size="xs" icon="sort-amount-down" />
                      ) : (
                        <FontAwesomeIcon size="xs" icon="sort-amount-up" />
                      ))}
                  </div>
                </th>
              ))}
              {ctrl!.showAddColumn && (
                <th className="pointer nowrap" onClick={() => ctrl!.toggleShowColumns()}>
                  {__!('generic.actions.addcol')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Percorre as linhas da listagem */}
            {ctrl!.list.map((tableCells, yindex) => (
              <tr key={yindex}>
                {/* Ações básicas da listagem */}
                <td className="pointer nowrap actions">
                  <ButtonGroup>
                    <Button size="sm" variant="outline-secondary">
                      &nbsp;
                    </Button>
                    <Button size="sm" variant="outline-primary" onClick={() => ctrl!.onEditClick(yindex)}>
                      <FontAwesomeIcon size="1x" icon={'edit'} />
                    </Button>
                    <Button size="sm" variant="outline-danger">
                      <FontAwesomeIcon size="1x" icon={'trash'} />
                    </Button>
                  </ButtonGroup>
                </td>
                {/* Percorre as células da linha*/}
                {tableCells.map((cell, xindex) => (
                  <td className="nowrap" style={{ maxWidth: (cell as TableCellInfo)?.head?.maxWidth }} key={xindex}>
                    <CellComp cell={cell} />
                  </td>
                ))}
                {ctrl!.showAddColumn && <td></td>}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    return (
      <>
        <Loader show={ctrl!.loading} vertical center />
        {content}
      </>
    );
  }
}

export function CellComp(props: { cell: TableCellInfo | TableCellInfo[] | TableGroupCellInfo | TableGroupCellInfo[] }) {
  if (Array.isArray(props.cell)) {
    return (props.cell as (TableCellInfo | TableGroupCellInfo)[]).map((cell, idx) => (
      <React.Fragment key={idx}>
        <CellComp cell={cell as TableCellInfo | TableGroupCellInfo} />{' '}
      </React.Fragment>
    ));
  } else if ((props.cell as TableGroupCellInfo).cells) {
    return (
      <>
        {'[ '}
        <CellComp cell={(props.cell as TableGroupCellInfo).cells} />
        {' ]'}
      </>
    );
  } else if ((props.cell as TableCellInfo).colorName) {
    return (
      <Badge variant={(props.cell as TableCellInfo).colorName}>
        {(props.cell as TableCellInfo).description || (props.cell as TableCellInfo).value}
      </Badge>
    );
  } else {
    return (props.cell as TableCellInfo).description || (props.cell as TableCellInfo).value;
  }
}

/***
 * Barra do topo com as funções da listagem
 */
@WMSI18N()
@inject('ctrl')
@observer
class FunctionsTabBar extends React.Component<{ ctrl?: CommonListStore; __?: Function }> {
  render() {
    const { __, ctrl } = this.props;
    const filtersLg = ctrl!.filtersApplied.length;
    return (
      <>
        <SortModal />
        <FiltersModal />
        <ColumnsModal />
        <SortListModal />
        <Nav className="p-1" variant="pills" style={{ justifyContent: 'space-between' }}>
          <Nav>
            <Nav.Item onClick={() => ctrl!.toggleShowFilters()} id="tg_filters">
              <Button size="sm" variant={filtersLg ? 'outline-primary' : 'link'}>
                <FontAwesomeIcon size="xs" icon="filter" /> {filtersLg ? filtersLg : null} {__!('menu.filters')}
              </Button>
            </Nav.Item>
            <Nav.Item onClick={() => ctrl!.toggleShowSort()} id="tg_sort">
              <Button size="sm" variant="link">
                <FontAwesomeIcon size="xs" icon="sort" /> {__!('menu.sort')}
              </Button>
            </Nav.Item>
            <Nav.Item onClick={() => ctrl!.toggleShowColumns()} id="tg_columns">
              <Button size="sm" variant="link">
                <FontAwesomeIcon size="xs" icon="columns" /> {__!('menu.columns')}
              </Button>
            </Nav.Item>
            <NavDropdown title="Export" id="nav-dropdown">
              <NavDropdown.Item eventKey="4.1">CSV</NavDropdown.Item>
              <NavDropdown.Item eventKey="4.2">XLS</NavDropdown.Item>
            </NavDropdown>
            <FiltersResume />
          </Nav>
          <Nav>
            {ctrl!.newCallback && (
              <Nav.Item onClick={() => ctrl!.onNewClick()}>
                <Button size="sm" variant="link">
                  <FontAwesomeIcon size="xs" icon={IconsDef.new} /> {__!('actions.new')}
                </Button>
              </Nav.Item>
            )}
            <Pagination className="mr-2" size="sm" style={{ marginBottom: 0 /*TODO: crias css*/ }}>
              <Pagination.Prev onClick={ctrl!.previewsPage} disabled={ctrl!.page === 1} id="previews_page" />
              <Pagination.Item>{ctrl!.page}</Pagination.Item>
              <Pagination.Item onClick={ctrl!.search}>
                <FontAwesomeIcon size="xs" icon={IconsDef.refresh} spin={ctrl!.loading} />
              </Pagination.Item>
              <Pagination.Next onClick={ctrl!.nextPage} id="next_page" />
            </Pagination>
          </Nav>
        </Nav>
      </>
    );
  }
}

/***
 * Barra do topo com as funções da listagem
 */
@WMSI18N()
@inject('ctrl')
@observer
class TopTabsBar extends React.Component<{ ctrl?: CommonListStore; __?: Function }> {
  render() {
    const { __, ctrl } = this.props;
    return (
      <Nav variant="tabs" activeKey={`#${ctrl!.activeListDefs}`}>
        <Nav.Item>
          <Nav.Link disabled>#</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={`#${ctrl!.defaultListDefs?.name}`} onClick={() => ctrl!.toggleCustomList(ctrl!.defaultListDefs)}>
            {__!('menu.list')}
          </Nav.Link>
        </Nav.Item>
        {ctrl!.customListDefs?.map((customListDef, key) => (
          <Nav.Item key={customListDef.name}>
            <Nav.Link href={`#${customListDef.name}`} onClick={() => ctrl!.toggleCustomList(customListDef)}>
              {customListDef.name}
            </Nav.Link>
          </Nav.Item>
        ))}
        <Nav.Item>
          <Nav.Link eventKey="disabled" onClick={() => ctrl!.saveCustomList()}>
            <FontAwesomeIcon size="xs" icon={IconsDef.save} />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}
