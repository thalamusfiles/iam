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
import { ApplicationEditStore } from '../ctrl';

const AboutComp: React.FC = () => {
  const ctrl = useCommonEditStore<ApplicationEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="application_about">
        {IconsDef.applications.map((icon) => (
          <FontAwesomeIcon icon={icon} />
        ))}
        &nbsp; {__('application.edit.about.title')}: {content.name}
      </h1>
      <p>{__('application.edit.about.description')}</p>
      <Form>
        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="initials"
              title="Initials"
              type={AttributeType.Text}
              value={content.name}
              onChange={(value) => assignContent({ name: value })}
            />
          </Col>
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
        </Row>
        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="description"
              title="Description"
              type={AttributeType.Text}
              value={content.name}
              onChange={(value) => assignContent({ name: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="region"
              title="Region"
              type={AttributeType.Text}
              value={content.name}
              onChange={(value) => assignContent({ name: value })}
            />
          </Col>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="public"
              title="With Public Access?"
              value={'1'}
              checked={content.public}
              onChange={() => assignContent({ public: !content.public })}
              type={AttributeType.Boolean}
            />
          </Col>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="noSSO"
              title="Without SSO"
              value={'1'}
              checked={content.noSSO}
              onChange={() => assignContent({ noSSO: !content.noSSO })}
              type={AttributeType.Boolean}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

addPagePlugin({
  component: AboutComp,
  name: 'application_about',
  sidebarTitle: 'About',
  target: TargetForm.application_edit,
  order: 0,
  displayInModal: true,
});
