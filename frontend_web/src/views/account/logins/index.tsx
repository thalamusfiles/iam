import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { LoginsCtx, LoginsProvider, useLoginStore } from './ctrl';

const LoginsPage: React.FC = () => {
  const __ = useI18N();

  return (
    <LoginsProvider value={new LoginsCtx()}>
      <h2 id="logins_about">
        <FontAwesomeIcon icon={IconsDef.login} /> {__('logins.title')}
      </h2>
      <p>{__('logins.description')}</p>
      <LoginsTable />
    </LoginsProvider>
  );
};

const LoginsTable: React.FC = () => {
  const __ = useI18N();
  const ctrl = useLoginStore();

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>{__('logins.login_at')}</th>
          <th>{__('logins.to_application')}</th>
        </tr>
      </thead>
      <tbody>
        {ctrl?.logins.map((on, idx) => (
          <tr key={idx}>
            <td>{on.loginAt}</td>
            <td>{on.applicationName}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LoginsPage;
