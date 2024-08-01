import { Button, Modal } from 'react-bootstrap';
import { useI18N } from '../../../../commons/i18';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { historyPush } from '../../../../commons/route';
import { IconsDef } from '../../../../commons/consts';
import { WmsFormGroup } from '../../../../components/Form';
import { AttributeType, PickersNames } from '../../../../commons/attribute-type';
import { TokensEditCtx, TokensEditProvider, useTokensEditStore } from './ctrl';
import { observer } from 'mobx-react-lite';

const TokensNewModalPage: React.FC = () => {
  const ctrl = new TokensEditCtx();

  return (
    <TokensEditProvider value={ctrl}>
      <TokensNewModalPageProvided />
    </TokensEditProvider>
  );
};

const TokensNewModalPageProvided: React.FC = observer(() => {
  const ctrl = useTokensEditStore();
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
          value={ctrl.content.name}
          onChange={(value) => ctrl.assignContent({ name: value })}
          invalidFeed={ctrl.erros?.name?.map(__)}
        />
        <WmsFormGroup
          name="name"
          title={__('account.tokens.grant')}
          type={PickersNames.scope}
          multi
          value={ctrl.content.scope}
          onChange={(scopes) => ctrl.assignContent({ scope: scopes.map((s: any) => s.initials).join(' ') })}
          invalidFeed={ctrl.erros?.scope?.map(__)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => historyPush(-1)}>{__('actions.close')}</Button>
        <Button onClick={ctrl.onSave}>{__('actions.save')}</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default TokensNewModalPage;
