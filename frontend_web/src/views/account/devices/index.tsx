import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { IconsDef } from '../../../commons/consts';
import { WMSI18N } from '../../../commons/i18';
import { DevicesConnectedStore } from './ctrl';

@WMSI18N()
export default class DevicesConnectedPage extends React.Component<any> {
  ctrl: DevicesConnectedStore;

  constructor(props: any) {
    super(props);

    this.ctrl = new DevicesConnectedStore();
  }

  render() {
    const { __ } = this.props;
    return (
      <Provider ctrl={this.ctrl}>
        <h1 id="devices_about">
          <FontAwesomeIcon icon={IconsDef.region} /> {__!('devices.title')}
        </h1>
        <p>{__!('devices.description')}</p>
        <DevicesConnectedTable />
      </Provider>
    );
  }
}

@inject('ctrl')
@observer
class DevicesConnectedTable extends React.Component<{ ctrl?: DevicesConnectedStore }> {
  render() {
    const { ctrl } = this.props;
    return (
      <Table responsive striped size="sm">
        <thead>
          <tr>
            <th>Devices</th>
            <th>Logged in since</th>
          </tr>
        </thead>
        <tbody>
          {ctrl?.devices.map((on) => (
            <tr key={on.id}>
              <td>{on.device}</td>
              <td>{on.loginAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
