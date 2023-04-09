import { observer } from 'mobx-react-lite';
import React from 'react';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { AttributeType } from '../../../../../commons/attribute-type';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { UserEditStore } from '../ctrl';

const ProfilesComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<UserEditStore>();
  const __ = useI18N();

  const { content, roles } = ctrl;

  const makeListGroup = (role: any, idx: number) => (
    <WmsFormGroup
      key={idx}
      groupAs={Col}
      name={role.name}
      title={role.name}
      value={role.id}
      checked={content.userRoles?.find((userRole: any) => userRole.uuid === role.uuid)}
      onChange={() => ctrl.toggleUserRole(role)}
      type={AttributeType.Boolean}
    />
  );

  return (
    <>
      <h2 id="user_roles">{__('user.edit.roles.title')}</h2>
      <p>{__('user.edit.roles.description')}</p>

      <Form>
        <Row>
          <Col>{roles.filter((_, idx) => idx % 3 === 0).map(makeListGroup)}</Col>
          <Col>{roles.filter((_, idx) => idx % 3 === 1).map(makeListGroup)}</Col>
          <Col>{roles.filter((_, idx) => idx % 3 === 2).map(makeListGroup)}</Col>
        </Row>
      </Form>

      <br />
    </>
  );
});

addPagePlugin({
  component: ProfilesComp,
  name: 'user_roles',
  sidebarTitle: 'Roles',
  target: TargetForm.user_edit,
  order: 20,
});
