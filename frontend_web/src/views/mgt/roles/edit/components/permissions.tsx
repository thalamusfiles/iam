import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const ctrl = useCommonEditStore<RoleEditStore>();
  const __ = useI18N();
  const [view, setView] = useState('table');

  const { permissions } = ctrl;
  const showList = view === 'list';
  const showTable = view === 'table';
  const showhierarchy = view === 'hierarchy';
  return (
    <>
      <Row>
        <Col>
          <h2 id="person_permissions">{__!('person.edit.permissions.title')}:</h2>
          <p>{__!('person.edit.permissions.description')}</p>
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
            {showList && <ListView permissions={permissions} />}
            {showTable && <ListTable permissions={permissions} />}
            {showhierarchy && <ListHierarchy permissions={permissions} />}
          </Col>
        </Row>
      </Form>
    </>
  );
};

const ListView: React.FC<{ permissions: any[] }> = ({ permissions }) => {
  return (
    <ListGroup>
      <Row>
        <Col>
          {permissions
            .filter((_, idx) => idx % 3 === 0)
            .map((perm) => (
              <ListGroup.Item>
                <Form.Check type="checkbox" readOnly checked={false} name={perm.name} label={perm.on + ' ' + perm.action} />
              </ListGroup.Item>
            ))}
        </Col>
        <Col>
          {permissions
            .filter((_, idx) => idx % 3 === 1)
            .map((perm) => (
              <ListGroup.Item>
                <Form.Check type="checkbox" readOnly checked={false} name={perm.name} label={perm.on + ' ' + perm.action} />
              </ListGroup.Item>
            ))}
        </Col>
        <Col>
          {permissions
            .filter((_, idx) => idx % 3 === 2)
            .map((perm) => (
              <ListGroup.Item>
                <Form.Check type="checkbox" readOnly checked={false} name={perm.name} label={perm.on + ' ' + perm.action} />
              </ListGroup.Item>
            ))}
        </Col>
      </Row>
    </ListGroup>
  );
};

const ListTable: React.FC<{ permissions: any[] }> = ({ permissions }) => {
  const ons = permissions.map((perm) => perm.on).filter((v, idx, self) => self.indexOf(v) === idx);
  const acts = permissions.map((perm) => perm.action).filter((v, idx, self) => self.indexOf(v) === idx);

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th></th>
          <th colSpan={acts.length} className="text-center">
            Actions
          </th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th>On</th>
          {acts.map((act) => (
            <th>{act}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ons.map((on) => (
          <tr>
            <td>{on}</td>
            {acts.map((act) => (
              <td>
                <Form.Check type="checkbox" readOnly checked={false} name={on + '_' + act} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ListHierarchy: React.FC<{ permissions: any[] }> = ({ permissions }) => {
  const ons = permissions.map((perm) => perm.on).filter((v, idx, self) => self.indexOf(v) === idx);
  const acts = permissions.map((perm) => perm.action).filter((v, idx, self) => self.indexOf(v) === idx);

  return (
    <ul>
      {ons.map((on) => (
        <li>
          {on}
          <ul>
            {acts.map((act) => (
              <li>
                <Form.Check type="checkbox" readOnly checked={false} name={on + '_' + act} label={act} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

addPagePlugin({
  component: PermissionComp,
  name: 'person_permissions',
  sidebarTitle: 'Permissions',
  target: TargetForm.role_edit,
  order: 30,
  displayInModal: true,
});
