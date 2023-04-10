import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { RoleEditStore } from '../ctrl';

const PermissionComp: React.FC = () => {
  const __ = useI18N();
  const [view, setView] = useState('table');

  const showList = view === 'list';
  const showTable = view === 'table';
  const showhierarchy = view === 'hierarchy';
  return (
    <>
      <Row>
        <Col>
          <h2 id="role_permissions">{__('role.edit.permissions.title')}</h2>
          <p>{__('role.edit.permissions.description')}</p>
        </Col>
        <Col md={2}>
          <ButtonGroup>
            <Button variant="light" active={showList} onClick={() => setView('list')}>
              <FontAwesomeIcon size="xs" icon={'list'} />
            </Button>
            <Button variant="light" active={showTable} onClick={() => setView('table')}>
              <FontAwesomeIcon size="xs" icon={'table'} />
            </Button>
            <Button variant="light" active={showhierarchy} onClick={() => setView('hierarchy')}>
              <FontAwesomeIcon size="xs" icon={'sitemap'} />
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Form>
        <Row>
          <Col>
            {showList && <ListView />}
            {showTable && <ListTable />}
            {showhierarchy && <ListHierarchy />}
          </Col>
        </Row>
      </Form>
    </>
  );
};

const ListView: React.FC = observer(() => {
  const ctrl = useCommonEditStore<RoleEditStore>();
  const { permissions } = ctrl;

  const makeListGroup = (perm: any, idx: number) => (
    <ListGroup.Item onClick={() => ctrl.togglePermission(perm.uuid)} key={idx}>
      <Form.Check
        type="checkbox"
        name={perm.initials}
        label={perm.on + ' ' + perm.action}
        checked={ctrl.contentPermissionsUuids.includes(perm.uuid)}
      />
    </ListGroup.Item>
  );

  return (
    <ListGroup>
      <Row>
        <Col>{permissions.filter((_, idx) => idx % 3 === 0).map(makeListGroup)}</Col>
        <Col>{permissions.filter((_, idx) => idx % 3 === 1).map(makeListGroup)}</Col>
        <Col>{permissions.filter((_, idx) => idx % 3 === 2).map(makeListGroup)}</Col>
      </Row>
    </ListGroup>
  );
});

const ListTable: React.FC = observer(() => {
  const ctrl = useCommonEditStore<RoleEditStore>();

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
        {ctrl.permissionsOns.map((on, idx) => (
          <tr key={idx}>
            <td>{on}</td>
            {ctrl.permissionsActs.map((act) => {
              const key = `${on}.${act}`;
              const perm = ctrl.permissionsByOnAct[key];
              return (
                <td key={key}>
                  <Form.Check
                    type="checkbox"
                    name={on + '_' + act}
                    disabled={!perm}
                    checked={ctrl.contentPermissionsUuids.includes(perm?.uuid)}
                    onClick={() => ctrl.togglePermission(perm?.uuid)}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

const ListHierarchy: React.FC = observer(() => {
  const ctrl = useCommonEditStore<RoleEditStore>();

  return (
    <ul>
      {ctrl.permissionsOnActTree.map(([on, acts]) => (
        <li>
          {on}
          <ul>
            {acts.map((act) => {
              const key = `${on}.${act}`;
              const perm = ctrl.permissionsByOnAct[key];
              return (
                <li>
                  <Form.Check
                    type="checkbox"
                    name={on + '_' + act}
                    label={act}
                    checked={ctrl.contentPermissionsUuids.includes(perm?.uuid)}
                    onClick={() => ctrl.togglePermission(perm?.uuid)}
                  />
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
});

addPagePlugin({
  component: PermissionComp,
  name: 'role_permissions',
  sidebarTitle: 'Permissions',
  target: TargetForm.role_edit,
  order: 30,
  displayInModal: true,
});
