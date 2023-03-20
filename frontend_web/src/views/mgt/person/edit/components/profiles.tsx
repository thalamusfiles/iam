import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { AttributeType } from '../../../../../commons/attribute-type';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { PersonEditStore } from '../ctrl';

const ProfilesComp: React.FC = () => {
  const ctrl = useCommonEditStore<PersonEditStore>();
  const __ = useI18N();

  const { content, roles, assignContent } = ctrl;

  const togglePersonRole = (role: any) => {
    const personRoles = content.personRoles || [];
    const idx = personRoles.findIndex((personRole: number) => personRole === role.id);
    if (idx > -1) {
      personRoles.splice(idx, 1);
    } else {
      personRoles.push(role.id);
    }
    assignContent({
      personRoles: personRoles,
    });
  };

  return (
    <>
      <h2 id="person_roles">{__!('person.edit.roles.title')}:</h2>
      <p>{__!('person.edit.roles.description')}</p>
      <Form>
        <Form.Row>
          {roles.map((role: any, idx) => (
            <WmsFormGroup
              groupAs={Col}
              key={idx}
              name={role.name}
              title={role.name}
              value={role.id}
              checked={content.personRoles?.includes(role.id)}
              onChange={() => togglePersonRole(role)}
              type={AttributeType.Boolean}
            />
          ))}
        </Form.Row>
      </Form>
    </>
  );
};

addPagePlugin({
  component: ProfilesComp,
  name: 'person_roles',
  sidebarTitle: 'Roles',
  target: TargetForm.person_edit,
  order: 20,
});
