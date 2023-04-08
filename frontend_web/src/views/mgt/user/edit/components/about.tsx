import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AttributeType } from '../../../../../commons/attribute-type';
import { IconsDef } from '../../../../../commons/consts';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { UserEditStore } from '../ctrl';

const AboutComp: React.FC = () => {
  const ctrl = useCommonEditStore<UserEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="user_about">
        {IconsDef.user.map((icon) => (
          <FontAwesomeIcon icon={icon} />
        ))}
        &nbsp; {__('user.edit.about.title')}: {content.name}
      </h1>
      <p>{__('user.edit.about.description')}</p>
      <Form>
        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="name"
              title="Name"
              type={AttributeType.Text}
              value={content.name}
              onChange={(value) => assignContent({ name: value })}
            />
          </Col>
          {/*<Col md={3}>
              <Figure>
                <Figure.Image width={171} height={180} alt="171x180" src="holder.js/171x180" />
                <Figure.Caption>User or Company Image</Figure.Caption>
              </Figure>
          </Col>*/}
        </Row>
      </Form>
    </>
  );
};

addPagePlugin({
  component: AboutComp,
  name: 'user_about',
  sidebarTitle: 'About',
  target: TargetForm.user_edit,
  order: 0,
  displayInModal: true,
});
