import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { DevicesConnectedCtx, DevicesConnectedProvider, useDevicesConnectedStore } from './ctrl';

const DevicesConnectedPage: React.FC = () => {
  const __ = useI18N();

  return (
    <DevicesConnectedProvider value={new DevicesConnectedCtx()}>
      <h2 id="devices_about">
        <FontAwesomeIcon icon={IconsDef.applications[1]} /> {__('devices.title')}
      </h2>
      <p>{__('devices.description')}</p>
      <DevicesConnectedTable />
    </DevicesConnectedProvider>
  );
};

const DevicesConnectedTable: React.FC = () => {
  const __ = useI18N();
  const ctrl = useDevicesConnectedStore();

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>{__('devices.devices')}</th>
          <th>{__('devices.logged_since')}</th>
        </tr>
      </thead>
      <tbody>
        {ctrl?.devices.map((on, idx) => (
          <tr key={idx}>
            <td>{on.device}</td>
            <td>{on.loginAt}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DevicesConnectedPage;
