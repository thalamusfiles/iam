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
import { RegionEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'region_about',
  sidebarTitle: 'About',
  target: TargetForm.region_edit,
  order: 0,
  displayInModal: true,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AboutComp extends CustomComponentA<{}, RegionEditStore> {
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
        <h1 id="region_about">
          <FontAwesomeIcon icon={IconsDef.region} />
          &nbsp; {__!('region.edit.about.title')}: {content.name}
        </h1>
        <p>{__!('region.edit.about.description')}</p>
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
        </Form>
      </>
    );
  }
}
