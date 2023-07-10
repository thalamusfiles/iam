import React from 'react';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useI18N } from '../../commons/i18';
import ThalamusLinksMenu from '../../components/NavBar/thalamus-links-menu';
import UserCtxInstance from '../../store/userContext';

const HeaderAccount: React.FC = () => {
  const __ = useI18N();

  return (
    <Navbar className="header">
      <Container fluid>
        <Navbar.Brand>
          <img src="/logo.png" alt="logo" />
          {__('menu.brand')} - {__('login.subtitle')}
        </Navbar.Brand>
        <Nav>
          <ThalamusLinksMenu />
          <div className="navbar-spacer" />

          <Nav.Item onClick={() => UserCtxInstance.logout()}>{__('menu.logout')}</Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default HeaderAccount;
