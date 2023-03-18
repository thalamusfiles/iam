import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useI18N } from '../../commons/i18';
import UserCtxInstance, { Ctx, useUserStore } from '../../store/userContext';
import ApplicationInfo from '../ApplicationInfo';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../Notification/ctrl';

type HeaderProps = {
  title?: string;
  icon?: IconName | Array<IconName>;
  fixed?: boolean;
  searchBar?: boolean;
  context?: Ctx;
  __?: Function;
};

const Header: React.FC<HeaderProps> = ({ icon, title, fixed, searchBar }) => {
  const __ = useI18N();
  const context = useUserStore();
  const isArray = Array.isArray(icon);
  return (
    <Navbar className="header" bg="warning" fixed={fixed ? 'top' : undefined}>
      <Navbar.Brand href="/mgt/home">
        <img src="/logo.png" alt="logo" />
        {__!('menu.brand')}
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" style={{ minWidth: 150 }}>
          <Nav.Link href="/mgt/home">{__!('menu.home')}</Nav.Link>
          {title !== 'menu.home' && (
            <Navbar.Text>
              <strong>
                {icon &&
                  (isArray ? (
                    (icon as Array<IconName>).map((icon: IconName, idx: any) => <FontAwesomeIcon key={idx} size="sm" icon={icon} />)
                  ) : (
                    <FontAwesomeIcon icon={icon as IconName} />
                  ))}
                &nbsp;
                {__!(title)}
              </strong>
            </Navbar.Text>
          )}
        </Nav>

        {searchBar && (
          <Form inline className="mr-auto">
            <FormControl type="text" placeholder={__!('menu.search')} className="mr-sm-2" />
          </Form>
        )}

        <Nav>
          <ApplicationInfo />

          <div className="navbar-spacer" />

          <Nav.Link href="https://docs.iam.thalamus.digital/" target="_blanck">
            {__!('menu.help')} <FontAwesomeIcon icon={'question-circle'} />
          </Nav.Link>

          <NotificationProvider value={NotificationValue}>
            <NotificationBell />
          </NotificationProvider>

          <div className="navbar-spacer" />

          <NavDropdown title={<FontAwesomeIcon icon={'user-circle'} />} id="user-dd">
            <NavDropdown.Item>{context?.user.name}</NavDropdown.Item>
            <NavDropdown title={__!('menu.language')} bsPrefix="dropdown-item" id="i18n-dd">
              <NavDropdown.Item onClick={() => UserCtxInstance.changeLanguage('en-US')}>{__!('menu.english')}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => UserCtxInstance.changeLanguage('pt-BR')}>{__!('menu.portuguese')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown.Item onClick={() => UserCtxInstance.logout()}>{__!('menu.logout')}</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
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
