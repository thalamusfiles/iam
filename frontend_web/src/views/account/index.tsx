import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useI18N } from '../../commons/i18';
import Footer from '../../components/Footer';
import NotificationMenu from '../../components/Notification';
import UserCtxInstance from '../../store/userContext';
import AccountRoutes from './routes';

const Account: React.FC = () => {
  return (
    <>
      <NotificationMenu />

      <HeaderAccount />

      <div className="mainContainer topSpace">
        <AccountRoutes />
      </div>

      <Footer />
    </>
  );
};

const HeaderAccount: React.FC = () => {
  const __ = useI18N();

  return (
    <Navbar className="header">
      <Navbar.Brand className="mr-auto">
        <img src="/logo.png" alt="logo" />
        {__!('menu.brand')} - {__!('login.subtitle')}
      </Navbar.Brand>
      <Nav>
        <Nav.Item onClick={() => UserCtxInstance.logout()}>{__!('menu.logout')}</Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default Account;
