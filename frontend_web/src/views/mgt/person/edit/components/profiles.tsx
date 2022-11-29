import { inject, observer } from 'mobx-react';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { AttributeType } from '../../../../../commons/attribute-type';
import { WMSI18N } from '../../../../../commons/i18';
import { CustomComponentA, TargetForm, WMSPagePlugin } from '../../../../../commons/plugin.component';
import { WmsFormGroup } from '../../../../../components/Form';
import { PersonEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'person_roles',
  sidebarTitle: 'Roles',
  target: TargetForm.person_edit,
  order: 20,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class ProfilesComp extends CustomComponentA<{}, PersonEditStore> {
  togglePersonRole = (role: any) => {
    const { content, assignContent } = this.props!.ctrl;
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

  render() {
    const { __, ctrl } = this.props;
    const { content, roles } = ctrl;

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
                onChange={() => this.togglePersonRole(role)}
                type={AttributeType.Boolean}
              />
            ))}
          </Form.Row>
        </Form>
      </>
    );
  }
}
