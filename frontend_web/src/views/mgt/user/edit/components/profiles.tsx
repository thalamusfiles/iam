import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { AttributeType } from '../../../../../commons/attribute-type';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { UserEditStore } from '../ctrl';

const ProfilesComp: React.FC = () => {
  const ctrl = useCommonEditStore<UserEditStore>();
  const __ = useI18N();

  const { content, roles, assignContent } = ctrl;

  const toggleUserRole = (role: any) => {
    const userRoles = content.userRoles || [];
    const idx = userRoles.findIndex((userRole: number) => userRole === role.id);
    if (idx > -1) {
      userRoles.splice(idx, 1);
    } else {
      userRoles.push(role.id);
    }
    assignContent({
      userRoles: userRoles,
    });
  };

  return (
    <>
      <h2 id="user_roles">{__('user.edit.roles.title')}:</h2>
      <p>{__('user.edit.roles.description')}</p>
      <Form>
        
          {roles.map((role: any, idx) => (
            <WmsFormGroup
              groupAs={Col}
              key={idx}
              name={role.name}
              title={role.name}
              value={role.id}
              checked={content.userRoles?.includes(role.id)}
              onChange={() => toggleUserRole(role)}
              type={AttributeType.Boolean}
            />
          ))}
        
      </Form>
    </>
  );
};

addPagePlugin({
  component: ProfilesComp,
  name: 'user_roles',
  sidebarTitle: 'Roles',
  target: TargetForm.user_edit,
  order: 20,
});
