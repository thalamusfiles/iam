import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { WMSI18N } from '../../../commons/i18';
import { CommonListStore } from './ctrl';


/***
 * Modal para aplicação da ordenação da listagem.
 */
@WMSI18N()
@inject('ctrl')
@observer
export class SortModal extends React.Component<{ ctrl?: CommonListStore; __?: Function }> {
  render() {
    const { __, ctrl } = this.props;
    return (
      <Modal size="lg" animation={false} show={ctrl!.showSort} onHide={() => ctrl!.toggleShowSort()}>
        <Modal.Header closeButton>
          <Modal.Title>{__!('menu.sort')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {ctrl!.sortableHeader.map((head, idx) => (
                <Col sm={4} key={idx}>
                  <Form.Group controlId={head.colname}>
                    <Form.Check
                      type="radio"
                      readOnly
                      name={'sort'}
                      value={head?.colname}
                      label={head.title}
                      checked={head?.colname === ctrl!.sort?.colname}
                      onClick={(e: any) => ctrl!.toggleSortOrder(head)}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => ctrl!.toggleShowSort()}>
            {__!('actions.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
