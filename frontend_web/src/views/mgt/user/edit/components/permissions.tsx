import { observer } from 'mobx-react-lite';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { UserEditStore } from '../ctrl';

const PermissionComp: React.FC = () => {
  const __ = useI18N();

  return (
    <>
      <h2 id="user_permissions">{__('user.edit.permissions.title')}</h2>
      <p>{__('user.edit.permissions.description')}</p>
      <Form>
        <Row>
          <Col>
            <ListTable />
          </Col>
        </Row>
      </Form>
      <br />
    </>
  );
};

const ListTable: React.FC = observer(() => {
  const ctrl = useCommonEditStore<UserEditStore>();

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th></th>
          <th colSpan={ctrl.permissionsActs.length} className="text-center">
            Actions
          </th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th>On</th>
          {ctrl.permissionsActs.map((act, idx) => (
            <th key={idx}>{act}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ctrl.permissionsOns.map((on) => (
          <tr>
            <td>{on}</td>
            {ctrl.permissionsActs.map((act) => {
              const key = `${on}.${act}`;
              const perm = ctrl.permissionsByOnAct[key];
              return (
                <td key={key}>
                  <Form.Check type="checkbox" name={on + '_' + act} disabled={true} checked={ctrl.permissionsUuids.includes(perm?.uuid)} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

addPagePlugin({
  component: PermissionComp,
  name: 'user_permissions',
  sidebarTitle: 'Permissions',
  target: TargetForm.user_edit,
  order: 30,
});
