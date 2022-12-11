import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { IconsDef } from '../../../commons/consts';
import { WMSI18N } from '../../../commons/i18';
import { LoginStore } from './ctrl';

@WMSI18N()
export default class LoginsPage extends React.Component<any> {
  ctrl: LoginStore;

  constructor(props: any) {
    super(props);

    this.ctrl = new LoginStore();
  }

  render() {
    const { __ } = this.props;
    return (
      <Provider ctrl={this.ctrl}>
        <h2 id="logins_about">
          <FontAwesomeIcon icon={IconsDef.login} /> {__!('logins.title')}
        </h2>
        <p>{__!('logins.description')}</p>
        <LoginsTable />
      </Provider>
    );
  }
}

@inject('ctrl')
@observer
class LoginsTable extends React.Component<{ ctrl?: LoginStore }> {
  render() {
    const { ctrl } = this.props;
    return (
      <Table responsive striped size="sm">
        <thead>
          <tr>
            <th>Login At</th>
            <th>To Application</th>
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
  }
}
