import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { WMSI18N } from '../../../../../commons/i18';
import { CustomComponentA, TargetForm, WMSPagePlugin } from '../../../../../commons/plugin.component';
import { PersonEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'person_authorization',
  sidebarTitle: 'Authorization',
  target: TargetForm.person_edit,
  order: 100,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AuthorizationComp extends CustomComponentA<{}, PersonEditStore> {
  render() {
    const { __ } = this.props;
    return (
      <>
        <h2 id="person_authorization">{__!('person.edit.auth.title')}:</h2>
        <p>{__!('person.edit.auth.description')}</p>
        <Form>
          <Row>
            <Col>
              <Button variant="outline-warning">Password reset</Button>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}
