import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { AttributeType } from '../../../commons/attribute-type';
import { IconsDef } from '../../../commons/consts';
import { WMSI18N } from '../../../commons/i18';
import { WmsFormGroup } from '../../../components/Form';
import { CommonListStore } from './ctrl';

/***
 * Modal para aplicação da ordenação da listagem.
 */
@WMSI18N()
@inject('ctrl')
@observer
export class SortListModal extends React.Component<{ ctrl?: CommonListStore; __?: Function }> {
  render() {
    const { __, ctrl } = this.props;
    if (!ctrl!.newCustomListDefs) return null;
    return (
      <Modal size="lg" animation={false} show={ctrl!.showSaveList} onHide={() => ctrl!.toggleShowSaveList()}>
        <Modal.Header closeButton>
          <Modal.Title>{__!('menu.save-list')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <p>{__!('msg.save-list.dest')}</p>
            <WmsFormGroup
              title={__!('field.name')}
              type={AttributeType.Text}
              name="listname"
              value={ctrl!.newCustomListDefs.name}
              onChange={(value) => ctrl!.assignNewCustomList({ name: value })}
            />
            <br />
            <p>
              <strong>{__!('msg.filterby')}: </strong>
              <br />
              {ctrl!.newCustomListDefs.filters
                ?.filter((filter) => filter.value !== undefined)
                .map((filter) => (
                  <p>
                    {filter.title}: {filter.description || filter.value}
                  </p>
                ))}
            </p>
            <p>
              <strong>{__!('msg.orderby')}: </strong>
              <br />
              {ctrl!.newCustomListDefs.sort?.title}
            </p>
            <p>
              <strong>{__!('msg.showcolumns')}: </strong>
              <br />
              {ctrl!.newCustomListDefs.columns
                ?.filter((head) => head.show)
                .map((head, idx) => head.title)
                .join(', ')}
            </p>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" disabled={ctrl!.newCustomListDefs.name.length < 3} onClick={() => ctrl!.saveCustomList(ctrl!.newCustomListDefs)}>
            <FontAwesomeIcon icon={IconsDef.save} /> {__!('actions.save')}
          </Button>
          <Button variant="secondary" onClick={() => ctrl!.toggleShowSaveList()}>
            <FontAwesomeIcon icon={IconsDef.close} /> {__!('actions.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
