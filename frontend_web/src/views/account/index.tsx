import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { WMSI18N } from '../../commons/i18';
import Footer from '../../components/Footer';
import NotificationProvider from '../../components/Notification';
import UserValue from '../../store/userContext';
import AccountRoutes from './routes';

const Account: React.FC<{}> = () => {
  return (
    <>
      <NotificationProvider />

      <HeaderAccount />

      <div className="mainContainer topSpace">
        <AccountRoutes />
      </div>

      <Footer />
    </>
  );
};

@WMSI18N()
class HeaderAccount extends React.Component<{ __?: Function }> {
  render() {
    const { __ } = this.props;
    return (
      <Navbar className="header">
        <Navbar.Brand className="mr-auto">
          <img src="/logo.png" alt="logo" />
          {__!('menu.brand')} - {__!('login.subtitle')}
        </Navbar.Brand>
        <Nav>
          <Nav.Item onClick={() => UserValue.logout()}>{__!('menu.logout')}</Nav.Item>
        </Nav>
      </Navbar>
    );
  }
}

export default Account;
