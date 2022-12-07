import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { WMSI18N } from '../../commons/i18';
import UserContext, { Ctx } from '../../store/userContext';
import ApplicationInfo from '../ApplicationInfo';
import { NotificationCtrl, notify } from '../Notification';

type HeaderProps = {
  title?: string;
  icon?: IconName | Array<IconName>;
  fixed?: boolean;
  searchBar?: boolean;
  context?: Ctx;
  __?: Function;
};

@WMSI18N()
@inject('context')
@observer
class Header extends React.Component<HeaderProps> {
  render() {
    const { __, icon, title, fixed, searchBar, context } = this.props;
    const isArray = Array.isArray(icon);
    return (
      <Navbar className="header" bg="warning" fixed={fixed ? 'top' : undefined}>
        <Navbar.Brand href="/mgt">
          <img src="/logo.png" alt="logo" />
          {__!('menu.brand')}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" style={{ minWidth: 150 }}>
            <Nav.Link href="/mgt">{__!('menu.home')}</Nav.Link>
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

            <Provider notify={notify}>
              <NotificationBell />
            </Provider>

            <div className="navbar-spacer" />

            <NavDropdown title={<FontAwesomeIcon icon={'user-circle'} />} id="user-dd">
              <NavDropdown.Item>{context?.user.name}</NavDropdown.Item>
              <NavDropdown title={__!('menu.language')} bsPrefix="dropdown-item" id="i18n-dd">
                <NavDropdown.Item onClick={() => UserContext.changeLanguage('en-US')}>{__!('menu.english')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => UserContext.changeLanguage('pt-BR')}>{__!('menu.portuguese')}</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Item onClick={() => UserContext.logout()}>{__!('menu.logout')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

@inject('notify')
@observer
class NotificationBell extends React.Component<{ notify?: NotificationCtrl }> {
  render() {
    const { notify } = this.props;
    return (
      <Nav.Link className={classnames({ 'text-info': !!notify?.amount })} onClick={() => notify!.showAll()}>
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={'bell'} />
          {notify?.amount && <span className="fa-layers-counter">{notify?.amount}</span>}
        </span>
      </Nav.Link>
    );
  }
}

export default Header;
