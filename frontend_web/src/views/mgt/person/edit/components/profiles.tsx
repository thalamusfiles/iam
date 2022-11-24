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
  componentDidMount = () => {
    this.loadProfileRoles();
  };

  loadProfileRoles = () => {
    /*const { configPersonRoles } = this.props!.ctrl;
    new ConfigPersonRoleCRUDDatasource().findAll().then((response) => {
      if (response)
        configPersonRoles = response
    });*/
  };

  togglePersonRole = (configPersonRole: any) => {
    const { content, assignContent } = this.props!.ctrl;
    const personRoles = content.personRoles || [];
    const idx = personRoles.findIndex((personRole: number) => personRole === configPersonRole.id);
    if (idx > -1) {
      personRoles.splice(idx, 1);
    } else {
      personRoles.push(configPersonRole.id);
    }
    assignContent({
      personRoles: personRoles,
    });
  };

  render() {
    const { __, ctrl } = this.props;
    const { content, configPersonRoles } = ctrl;

    return (
      <>
        <h2 id="person_roles">
          {__!('person.edit.roles.title')}: {content.name}
        </h2>
        <p>{__!('person.edit.roles.description')}</p>
        <Form>
          <Form.Row>
            {configPersonRoles.map((configPersonRole: any, idx) => (
              <WmsFormGroup
                groupAs={Col}
                key={idx}
                name={configPersonRole.name}
                title={configPersonRole.name}
                value={configPersonRole.id}
                checked={content.personRoles?.includes(configPersonRole.id)}
                onChange={() => this.togglePersonRole(configPersonRole)}
                type={AttributeType.Boolean}
              />
            ))}
          </Form.Row>
        </Form>
      </>
    );
  }
}
