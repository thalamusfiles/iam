import { observer } from 'mobx-react-lite';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useI18N } from '../../../commons/i18';
import { RegisterCtrl } from '../register/ctrl';
import { LoginCtrl } from './ctrl';

const PermissionInfoModal: React.FC<{ ctrl: LoginCtrl | RegisterCtrl }> = observer(({ ctrl }) => {
  const __ = useI18N();

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={ctrl.permissionModalDisplay} onHide={() => ctrl.hidePermissionModal()}>
      <Modal.Header closeButton>
        <Modal.Title>{__('login.permissions.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{__('login.permissions-info')}</p>

        <ListGroup as="ol" numbered>
          {ctrl.scopeInfo?.map((info, idx) => (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={idx}>
              <div className="ms-2 me-auto">
                <div className="fw-bold">{info.permission.description}</div>
                {__('login.application')}: {info.app.name}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => ctrl.hidePermissionModal()}>{__('actions.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default PermissionInfoModal;
