import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { useCommonListStore } from './ctrl';
import { TableHeadSeparator } from './types/TableHead';

/***
 * Modal para aplicação dos filtros.
 */
export const ColumnsModal: React.FC = observer(() => {
  const ctrl = useCommonListStore();
  const __ = useI18N();

  return (
    <Modal size="lg" animation={false} show={ctrl!.showColumns} onHide={() => ctrl!.toggleShowColumns()}>
      <Modal.Header closeButton>
        <Modal.Title>{__('menu.columns')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            {ctrl!.columnsDefs.map((head: any, idx: number) =>
              head.type === TableHeadSeparator ? (
                <Col sm={12} key={idx}>
                  {head.title}
                  <hr />
                </Col>
              ) : (
                <Col sm={3} key={idx}>
                  <Form.Group controlId={head.colname}>
                    <Form.Check
                      type="checkbox"
                      readOnly
                      checked={head.show}
                      name={head.colname}
                      label={head.title}
                      onClick={(e: any) => ctrl!.columnsChange(e, head, idx)}
                    />
                  </Form.Group>
                </Col>
              ),
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={ctrl!.clearColumns} className="pull-left">
          <FontAwesomeIcon icon={IconsDef.clear} /> {__('actions.clear')}
        </Button>
        <Button variant="secondary" onClick={() => ctrl!.toggleShowColumns()}>
          <FontAwesomeIcon icon={IconsDef.close} /> {__('actions.close')}
        </Button>
        <Button variant="primary" onClick={() => ctrl!.applyColumns()}>
          <FontAwesomeIcon icon={IconsDef.save} /> {__('actions.applycolumns')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
