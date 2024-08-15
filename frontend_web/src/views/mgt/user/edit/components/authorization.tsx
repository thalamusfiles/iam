import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';

const AuthorizationComp: React.FC = () => {
  const __ = useI18N();

  return (
    <>
      <h2 id="user_authorization">{__('user.edit.auth.title')}</h2>
      <p>{__('user.edit.auth.description')}</p>
      <Form>
        <Row>
          <Col>
            <Button variant="outline-warning" onClick={() => alert('Fincionalidade indisponível')}>
              Redefinir senha.
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

addPagePlugin({
  component: AuthorizationComp,
  name: 'user_authorization',
  sidebarTitle: 'Authorization',
  target: TargetForm.user_edit,
  order: 20,
});
