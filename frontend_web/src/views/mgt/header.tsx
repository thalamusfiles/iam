import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as json from '../../../package.json';
import { useI18N } from '../../commons/i18';
import { historyPush } from '../../commons/route';
import ApplicationInfo from '../../components/ApplicationInfo';
import ThalamusLinksMenu from '../../components/NavBar/thalamus-links-menu';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../../components/Notification/ctrl';
import UserCtxInstance, { useUserStore } from '../../store/userContext';

const { docUrl } = json as any;

const Header: React.FC = () => {
  const __ = useI18N();
  const context = useUserStore();

  return (
    <Navbar className="header" bg="warning" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/mgt/home">
          <>
            <img src="/logo.png" alt="logo" />
            {__('menu.brand')}
          </>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto" style={{ minWidth: 150 }}>
            <Nav.Link href="/mgt/home">{__('menu.home')}</Nav.Link>
          </Nav>

          <Form className="me-auto">
            <FormControl type="text" placeholder={__('menu.search')} className="mr-sm-2" />
          </Form>

          <Nav className="me-end">
            <ApplicationInfo />

            <div className="navbar-spacer" />

            <Nav.Link href={docUrl} target="_blanck">
              <FontAwesomeIcon icon={'question-circle'} /> {__('menu.help')}
            </Nav.Link>

            <NotificationProvider value={NotificationValue}>
              <NotificationBell />
            </NotificationProvider>
            <div className="navbar-spacer" />

            <ThalamusLinksMenu />
            <div className="navbar-spacer" />

            <NavDropdown title={<FontAwesomeIcon icon={'user-circle'} />} id="user-dd">
              <NavDropdown.Item onClick={() => historyPush('home_account')}>{context?.user.name}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => UserCtxInstance.logout()}>{__('menu.logout')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const NotificationBell: React.FC = () => {
  const notify = useNotificationStore();
  return (
    <Nav.Link className={classnames({ 'text-info': !!notify?.amount })} onClick={() => notify!.showAll()}>
      <span className="fa-layers fa-fw">
        <FontAwesomeIcon icon={'bell'} />
        {notify?.amount && <span className="fa-layers-counter">{notify?.amount}</span>}
      </span>
    </Nav.Link>
  );
};

export default Header;
