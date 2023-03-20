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
import { PermissionEditStore } from '../ctrl';

const AboutComp: React.FC = () => {
  const ctrl = useCommonEditStore<PermissionEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="permission_about">
        <FontAwesomeIcon icon={IconsDef.permissions} />
        &nbsp; {__('permission.edit.about.title')}: {content.name}
        <ApplicationInfo />
      </h1>
      <p>{__('permission.edit.about.description')}</p>
      <Form>
        <Row>
          <Col>
            <Form.Row>
              <WmsFormGroup
                groupAs={Col}
                name="on"
                title="On"
                type={AttributeType.Text}
                value={content.name}
                onChange={(value) => assignContent({ on: value })}
              />
            </Form.Row>
          </Col>
          <Col>
            <Form.Row>
              <WmsFormGroup
                groupAs={Col}
                name="action"
                title="Action"
                type={AttributeType.Text}
                value={content.name}
                onChange={(value) => assignContent({ action: value })}
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
                disabled
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
};

addPagePlugin({
  component: AboutComp,
  name: 'permission_about',
  sidebarTitle: 'About',
  target: TargetForm.permission_edit,
  order: 0,
  displayInModal: true,
});
