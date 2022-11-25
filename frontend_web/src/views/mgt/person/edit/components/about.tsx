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
import { PersonEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'person_about',
  sidebarTitle: 'About',
  target: TargetForm.person_edit,
  order: 0,
  displayInModal: true,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AboutComp extends CustomComponentA<{}, PersonEditStore> {
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
        <h1 id="person_about">
          {IconsDef.person.map((icon) => (
            <FontAwesomeIcon icon={icon} />
          ))}
          &nbsp; {__!('person.edit.about.title')}: {content.name}
        </h1>
        <p>{__!('person.edit.about.description')}</p>
        <Form>
          <Row>
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
            {/*<Col md={3}>
              <Figure>
                <Figure.Image width={171} height={180} alt="171x180" src="holder.js/171x180" />
                <Figure.Caption>Person or Company Image</Figure.Caption>
              </Figure>
          </Col>*/}
          </Row>
        </Form>
      </>
    );
  }
}
