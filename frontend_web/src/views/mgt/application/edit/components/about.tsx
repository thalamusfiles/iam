import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Alert } from 'react-bootstrap';
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

const AboutComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<ApplicationEditStore>();
  const __ = useI18N();

  const { content, assignContent } = ctrl;

  return (
    <>
      <h1 id="application_about">
        {IconsDef.applications.map((icon, idx) => (
          <FontAwesomeIcon icon={icon} key={idx} />
        ))}
        &nbsp; {__('application.edit.about.title')}: {content.name || __('info.uninformed')}
      </h1>
      <p>{__('application.edit.about.description')}</p>
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
              name="initials"
              title="Initials"
              type={AttributeType.Text}
              value={content.initials}
              onChange={(value) => assignContent({ initials: value })}
              disabled={content.uuid}
              appendFeed={__('application.edit.about.initials_append')}
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
              invalidFeed={ctrl.erros.name?.map(__)}
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
              invalidFeed={ctrl.erros.description?.map(__)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <WmsFormGroup
              groupAs={Col}
              name="public"
              title="With Public Access?"
              value={'1'}
              checked={content.public}
              onChange={() => assignContent({ public: !content.public })}
              type={AttributeType.Boolean}
              invalidFeed={ctrl.erros.public?.map(__)}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
});

addPagePlugin({
  component: AboutComp,
  name: 'application_about',
  sidebarTitle: 'About',
  target: TargetForm.application_edit,
  order: 0,
  displayInModal: true,
});
