import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { WmsFormGroup } from '../../../components/Form';
import { CommonListCtx, useCommonListStore } from './ctrl';
import { FilterDef } from './types/FilterDef';

/***
 * Modal para aplicação dos filtros.
 */
export const FiltersModal: React.FC = observer(() => {
  const ctrl = useCommonListStore();
  const __ = useI18N();

  return (
    <Modal size="lg" animation={false} show={ctrl!.showFilters} onHide={() => ctrl!.toggleShowFilters()}>
      <Modal.Header closeButton>
        <Modal.Title>{__('menu.filters')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            {ctrl!.filtersDefs.map((filter, idx) => (
              <Col sm={4} key={idx}>
                <WmsFormGroup
                  {...filter}
                  disabled={(filter as any).fixed || false}
                  onChange={(value, description, event) => ctrl!.filterChange(value.id || value, description as string, filter, idx, event)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={ctrl!.clearFilters} className="pull-left">
          <FontAwesomeIcon icon={IconsDef.clear} /> {__('actions.clear')}
        </Button>
        {ctrl!.filtersApplied.length > 0 && (
          <Button variant="warning" onClick={ctrl!.resetFilters} className="pull-left">
            <FontAwesomeIcon icon={IconsDef.reset} /> {__('actions.reset')}
          </Button>
        )}
        <Button variant="secondary" onClick={() => ctrl!.toggleShowFilters()}>
          <FontAwesomeIcon icon={IconsDef.close} /> {__('actions.close')}
        </Button>
        <Button variant="primary" onClick={() => ctrl!.applyFilters()}>
          <FontAwesomeIcon icon={IconsDef.filter} /> {__('actions.applyfilter')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

/***
 * Resumo dos filtros aplicados
 */
export const FiltersResume: React.FC = observer(() => {
  const ctrl = useCommonListStore();
  const __ = useI18N();

  //Verifica se possui filtro informado
  if (!ctrl!.filtersApplied.length) return null;

  return (
    <>
      <Nav.Item>
        <Nav.Link disabled>{__('menu.filters')}:</Nav.Link>
      </Nav.Item>
      {ctrl!.filtersApplied.map((filter, idx) => (
        <OverlayTrigger placement={'top'} overlay={<Tooltip id={`tooltip-${idx}`}>{__('generic.tooltip.filter-remove')}</Tooltip>} key={idx}>
          <Nav.Item className="pointer" onClick={() => ctrl!.removeFilter(filter, idx)}>
            <Nav.Link disabled>
              {filter.title}: {filter.description || filter.value}
            </Nav.Link>
          </Nav.Item>
        </OverlayTrigger>
      ))}
    </>
  );
});

/**
 * Seleção rápida de filtros
 * exibido na abertura da tela.
 */
export const FastFilters: React.FC<{ inSide?: boolean }> = observer(({ inSide }) => {
  const ctrl = useCommonListStore();
  const __ = useI18N();

  const length = ctrl!.fastFilters?.length;
  if (!length) return null;

  const hasCustom = ctrl!.customListDefs.length > 0;
  const hasMultiple = Array.isArray(ctrl!.fastFilters![0]) ? length : 0;
  //Cálculo de divisão dos componentes
  const span = inSide ? 12 : 4 + hasMultiple;
  const offset = (12 - span) / 2;
  const custoSpan = span > 8 ? 12 : 3;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={12} md={{ span: span, offset }}>
          <Button variant="outline-primary" onClick={() => ctrl!.applyFilters()}>
            {length > 2 || hasMultiple ? __('menu.all') : __('menu.both')}
          </Button>
          <br />
          <CascadeFilterGroup filters={ctrl!.fastFilters!} ctrl={ctrl!} />
          <br />
        </Col>

        {hasCustom && (
          <Col md={custoSpan}>
            <Button variant="outline-info" disabled>
              {__('menu.customlists')}
            </Button>
            <br />
            {ctrl!.customListDefs.map((customList, key) => (
              <Button variant="outline-secondary" key={key} onClick={() => ctrl!.toggleCustomList(customList)}>
                {customList.name}
              </Button>
            ))}
          </Col>
        )}
      </Row>
    </Container>
  );
});

export const CascadeFilterGroup: React.FC<{ ctrl: CommonListCtx; filters: FilterDef[] }> = ({ ctrl, filters }) => {
  const hasMultiple = Array.isArray(filters[0]);

  if (hasMultiple) {
    return (
      <Row>
        {filters.map((filter, key) => (
          <Col>
            <CascadeFilterGroup key={key} filters={filter as any as FilterDef[]} ctrl={ctrl!} />
          </Col>
        ))}
      </Row>
    );
  } else {
    return (
      <>
        {filters.map((filter, key) => (
          <FilterButton key={key} filter={filter} ctrl={ctrl!} />
        ))}
      </>
    );
  }
};

export const FilterButton: React.FC<{ ctrl: CommonListCtx; filter: FilterDef }> = ({ ctrl, filter }) => {
  return (
    <Button variant="secondary" onClick={() => ctrl!.addFilter(filter)}>
      {filter.title}
    </Button>
  );
};
