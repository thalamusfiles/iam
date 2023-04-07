import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Alert } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AttributeType, PickersNames } from '../../../../../commons/attribute-type';
import { IconsDef } from '../../../../../commons/consts';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import ApplicationInfo from '../../../../../components/ApplicationInfo';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { RoleEditStore } from '../ctrl';

const AboutComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<RoleEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="role_about">
        <FontAwesomeIcon icon={IconsDef.roles} />
        &nbsp; {__('role.edit.about.title')}: {content.name || __('info.uninformed')}
        <ApplicationInfo />
      </h1>
      <p>{__('role.edit.about.description')}</p>
      <Form>
        {!!ctrl.erroMessages?.length && (
          <Alert variant="danger">
            {ctrl.erroMessages.map((msg) => (
              <>
                {__(msg)} <br />
              </>
            ))}
          </Alert>
        )}

        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="application"
              title="Application"
              type={PickersNames.application}
              value={content.application?.name}
              onChange={(value) => assignContent({ application: value })}
              disabled={content.uuid}
              appendFeed={__('role.edit.about.initials_append')}
              invalidFeed={ctrl.erros?.application?.map(__)}
            />
          </Col>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="initials"
              title="Initials"
              type={AttributeType.Text}
              value={content.initials}
              onChange={(value) => assignContent({ initials: value.replace(/[ ^"]/g, '_') })}
              disabled={content.uuid}
              appendFeed={__('role.edit.about.initials_append')}
              invalidFeed={ctrl.erros?.initials?.map(__)}
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
              invalidFeed={ctrl.erros?.name?.map(__)}
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
              value={content.description}
              onChange={(value) => assignContent({ description: value })}
              invalidFeed={ctrl.erros?.description?.map(__)}
            />
          </Col>
        </Row>
      </Form>
      <br />
    </>
  );
});

addPagePlugin({
  component: AboutComp,
  name: 'role_about',
  sidebarTitle: 'About',
  target: TargetForm.role_edit,
  order: 0,
  displayInModal: true,
});
