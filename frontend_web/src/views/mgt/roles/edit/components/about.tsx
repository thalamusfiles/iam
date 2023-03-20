import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AttributeType } from '../../../../../commons/attribute-type';
import { IconsDef } from '../../../../../commons/consts';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import ApplicationInfo from '../../../../../components/ApplicationInfo';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { RoleEditStore } from '../ctrl';

const AboutComp: React.FC = () => {
  const ctrl = useCommonEditStore<RoleEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="role_about">
        <FontAwesomeIcon icon={IconsDef.roles} />
        &nbsp; {__('role.edit.about.title')}: {content.name}
        <ApplicationInfo />
      </h1>
      <p>{__('role.edit.about.description')}</p>
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
      </Form>
    </>
  );
};

addPagePlugin({
  component: AboutComp,
  name: 'role_about',
  sidebarTitle: 'About',
  target: TargetForm.role_edit,
  order: 0,
  displayInModal: true,
});
