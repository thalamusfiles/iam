import { observer } from 'mobx-react-lite';
import { Table } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { PermissionEditStore } from '../ctrl';

const RolesComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<PermissionEditStore>();
  const __ = useI18N();

  return (
    <>
      <Row>
        <Col>
          <h2 id="permissions_role">{__('permission.edit.roles.title')}</h2>
          <p>{__('permission.edit.roles.description')}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table className="table-resizable" hover size="sm" bordered>
            <thead>
              <tr>
                <th>{__('role.list.initials')}</th>
                <th>{__('role.list.name')}</th>
              </tr>
            </thead>
            <tbody>
              {ctrl.contentRoles.map((role) => (
                <tr>
                  <th>{role.initials}</th>
                  <th>{role.name}</th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
});

addPagePlugin({
  component: RolesComp,
  name: 'permission_about',
  sidebarTitle: 'Roles',
  target: TargetForm.permission_edit,
  order: 0,
  displayInModal: true,
});
