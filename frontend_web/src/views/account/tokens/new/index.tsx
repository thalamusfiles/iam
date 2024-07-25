import { Button, Modal } from 'react-bootstrap';
import { useI18N } from '../../../../commons/i18';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { historyPush } from '../../../../commons/route';
import { IconsDef } from '../../../../commons/consts';
import { WmsFormGroup } from '../../../../components/Form';
import { AttributeType } from '../../../../commons/attribute-type';

const TokensNewModalPage: React.FC = () => {
  const __ = useI18N();

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={true} onHide={() => historyPush(-1)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={IconsDef.tokens} /> {__('account.tokens.new.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{__('account.tokens.new.description')}</p>
        <WmsFormGroup
          name="name"
          title={__('account.tokens.name')}
          type={AttributeType.Text}
          value={''}
          onChange={(value) => false /*assignContent({ name: value })*/}
          invalidFeed={'ctrl.erros?.name?.map(__)'}
        />
        <WmsFormGroup
          name="name"
          title={__('account.tokens.grant')}
          type={AttributeType.Text}
          value={''}
          onChange={(value) => false /*assignContent({ name: value })*/}
          invalidFeed={'ctrl.erros?.name?.map(__)'}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => historyPush(-1)}>{__('actions.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TokensNewModalPage;
