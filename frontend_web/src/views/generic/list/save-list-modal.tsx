import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { AttributeType } from '../../../commons/attribute-type';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { WmsFormGroup } from '../../../components/Form';
import { useCommonListStore } from './ctrl';

/***
 * Modal para aplicação da ordenação da listagem.
 */
export const SaveListModal: React.FC = observer(() => {
  const ctrl = useCommonListStore();
  const __ = useI18N();

  if (!ctrl!.newCustomListDefs) return null;
  return (
    <Modal size="lg" animation={false} show={ctrl!.showSaveList} onHide={() => ctrl!.toggleShowSaveList()}>
      <Modal.Header closeButton>
        <Modal.Title>{__('generic.list.save-list.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <p>{__('generic.list.save-list.desc')}</p>
          <WmsFormGroup
            title={__('generic.list.name')}
            type={AttributeType.Text}
            name="listname"
            value={ctrl!.newCustomListDefs.name}
            onChange={(value) => ctrl!.assignNewCustomList({ name: value })}
          />
          <br />
          <p>
            <strong>{__('menu.filters')}: </strong>
            <br />
            {ctrl!.newCustomListDefs.filters
              ?.filter((filter: any) => filter.value !== undefined)
              .map((filter: any, idx) => (
                <p key={idx}>
                  {filter.title}: {filter.description || filter.value}
                </p>
              ))}
          </p>
          <p>
            <strong>{__('menu.sort')}: </strong>
            <br />
            {ctrl!.newCustomListDefs.sort?.title}
          </p>
          <p>
            <strong>{__('menu.columns')}: </strong>
            <br />
            {ctrl!.newCustomListDefs.columns
              ?.filter((head: any) => head.show)
              .map((head: any, idx: number) => head.title)
              .join(', ')}
          </p>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" disabled={ctrl!.newCustomListDefs.name.length < 3} onClick={() => ctrl!.saveCustomList(ctrl!.newCustomListDefs)}>
          <FontAwesomeIcon icon={IconsDef.save} /> {__('actions.save')}
        </Button>
        <Button variant="secondary" onClick={() => ctrl!.toggleShowSaveList()}>
          <FontAwesomeIcon icon={IconsDef.close} /> {__('actions.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
