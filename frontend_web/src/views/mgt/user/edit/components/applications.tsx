import { observer } from 'mobx-react-lite';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { UserEditStore } from '../ctrl';

const ApplicationComp: React.FC = observer(() => {
  const ctrl = useCommonEditStore<UserEditStore>();
  const __ = useI18N();

  const { applications } = ctrl;

  return (
    <>
      <h2 id="user_authorization">{__('user.edit.application.title')}</h2>
      <p>{__('user.edit.application.description')}</p>
      <Table responsive>
        <thead>
          <tr>
            <th>{__('application.name')}</th>
            <th>{__('application.description')}</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.uuid}>
              <td>{app.name}</td>
              <td>{app.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
    </>
  );
});

addPagePlugin({
  component: ApplicationComp,
  name: 'user_about',
  sidebarTitle: 'About',
  target: TargetForm.user_edit,
  order: 30,
  displayInModal: true,
});
