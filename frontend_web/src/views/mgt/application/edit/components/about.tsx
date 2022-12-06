import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AttributeType } from '../../../../../commons/attribute-type';
import { IconsDef } from '../../../../../commons/consts';
import { WMSI18N } from '../../../../../commons/i18';
import { CustomComponentA, TargetForm, WMSPagePlugin } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { ApplicationEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'application_about',
  sidebarTitle: 'About',
  target: TargetForm.application_edit,
  order: 0,
  displayInModal: true,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AboutComp extends CustomComponentA<{}, ApplicationEditStore> {
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
        <h1 id="application_about">
          {IconsDef.applications.map((icon) => (
            <FontAwesomeIcon icon={icon} />
          ))}
          &nbsp; {__!('application.edit.about.title')}: {content.name}
        </h1>
        <p>{__!('application.edit.about.description')}</p>
        <Form>
          <Row>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="initials"
                  title="Initials"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
              </Form.Row>
            </Col>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="name"
                  title="Name"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
              </Form.Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="description"
                  title="Description"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
              </Form.Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="region"
                  title="Region"
                  type={AttributeType.Text}
                  value={content.name}
                  onChange={(value) => assignContent({ name: value })}
                />
              </Form.Row>
            </Col>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="public"
                  title="With Public Access?"
                  value={'1'}
                  checked={content.public}
                  onChange={() => assignContent({ public: !content.public })}
                  type={AttributeType.Boolean}
                />
              </Form.Row>
            </Col>
            <Col>
              <Form.Row>
                <WmsFormGroup
                  groupAs={Col}
                  name="noSSO"
                  title="Without SSO"
                  value={'1'}
                  checked={content.noSSO}
                  onChange={() => assignContent({ noSSO: !content.noSSO })}
                  type={AttributeType.Boolean}
                />
              </Form.Row>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}
