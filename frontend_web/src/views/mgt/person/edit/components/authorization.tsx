import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';

const AuthorizationComp: React.FC = () => {
  //const ctrl = useCommonEditStore<PersonEditStore>();
  const __ = useI18N();
  //const { content, assignContent } = ctrl;

  return (
    <>
      <h2 id="person_authorization">{__('person.edit.auth.title')}:</h2>
      <p>{__('person.edit.auth.description')}</p>
      <Form>
        <Row>
          <Col>
            <Button variant="outline-warning">Password reset</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

addPagePlugin({
  component: AuthorizationComp,
  name: 'person_authorization',
  sidebarTitle: 'Authorization',
  target: TargetForm.person_edit,
  order: 100,
});
