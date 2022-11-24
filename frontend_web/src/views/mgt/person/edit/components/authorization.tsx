import { inject, observer } from 'mobx-react';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AttributeType } from '../../../../../commons/attribute-type';
import { WMSI18N } from '../../../../../commons/i18';
import { CustomComponentA, TargetForm, WMSPagePlugin } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { PersonEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'person_authorization',
  sidebarTitle: 'Authorization',
  target: TargetForm.person_edit,
  order: 10,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AuthorizationComp extends CustomComponentA<{}, PersonEditStore> {
  assignAttribute = (assign: any) => {
    const { content, assignContent } = this.props!.ctrl;
    assignContent({
      attributes: Object.assign({}, content.attributes, assign),
    });
  };

  render() {
    const { __, ctrl } = this.props;
    const { content, assignContent } = ctrl;
    return (
      <>
        <h2 id="person_authorization">
          {__!('person.edit.auth.title')}: {content.name}
        </h2>
        <p>{__!('person.edit.auth.description')}</p>
        <Form>
          <Row>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="username"
                  title="Username"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
                <WmsFormGroup
                  groupAs={Col}
                  name="password"
                  title="Password"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
              </Form.Row>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}
