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
import { PersonEditStore } from '../ctrl';

const AboutComp: React.FC = () => {
  const ctrl = useCommonEditStore<PersonEditStore>();
  const __ = useI18N();

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
};

addPagePlugin({
  component: AboutComp,
  name: 'person_about',
  sidebarTitle: 'About',
  target: TargetForm.person_edit,
  order: 0,
  displayInModal: true,
});
