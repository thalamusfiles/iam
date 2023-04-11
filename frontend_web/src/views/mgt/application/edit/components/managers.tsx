import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { PickersNames } from '../../../../../commons/attribute-type';
import { IconsDef } from '../../../../../commons/consts';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { IamInputGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { ApplicationEditStore } from '../ctrl';

const AboutComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<ApplicationEditStore>();
  const __ = useI18N();

  const { content } = ctrl;

  return (
    <>
      <h2 id="application_managers">{__('application.edit.managers.title')}</h2>
      <p>{__('application.edit.managers.description')}</p>
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
            {content.managerSelected?.name}
            <IamInputGroup
              groupAs={Col}
              name="manager"
              type={PickersNames.user}
              description={content.managerSelected?.name}
              onChange={(value) => ctrl.onChangeManager(value)}
              append={
                <Button size="sm" variant="outline-primary" className="float-end" onClick={() => ctrl.onAddManager()}>
                  <FontAwesomeIcon size="1x" icon={IconsDef.add} /> {__('actions.add')}
                </Button>
              }
            />
          </Col>
        </Row>

        <Table responsive striped size="sm">
          <thead>
            <tr>
              <th></th>
              <th>{__('application.edit.manager')}</th>
              <th>{__('application.edit.username')}</th>
            </tr>
          </thead>
          <tbody>
            {ctrl.content?.managers?.map((manager: any, idx: number) => (
              <tr key={idx}>
                <td>
                  <Button size="sm" variant="outline-danger" onClick={() => ctrl.onRemoveManager(manager, idx)}>
                    <FontAwesomeIcon size="1x" icon={IconsDef.delete} />
                  </Button>
                </td>
                <td>{manager.name}</td>
                <td>{manager?.userLogins?.map((userLogin: any) => userLogin.username)?.join(', ')}</td>
              </tr>
            ))}
            {!ctrl.content?.managers?.length && (
              <tr className="text-center">
                <td colSpan={3}>{__('generic.list.empty')}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Form>
    </>
  );
});

addPagePlugin({
  component: AboutComp,
  name: 'application_managers',
  sidebarTitle: 'Managers',
  target: TargetForm.application_edit,
  order: 0,
  displayInModal: true,
});
