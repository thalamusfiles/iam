import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useI18N } from '../../../commons/i18';
import DevicesConnectedPage from '../devices';
import LoginsPage from '../logins';
import { AccountHomeCtrl, AccountHomeProvider, useAccountHomeStore } from './ctrl';
import SideBarHome from './sidebarhome';

const HomeAccountPage: React.FC = () => {
  const ctrl = new AccountHomeCtrl();

  useEffect(() => {
    ctrl.init();
  });

  return (
    <AccountHomeProvider value={ctrl}>
      <HomeAccountPageProvided />
    </AccountHomeProvider>
  );
};

const HomeAccountPageProvided: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col md={3}>
          <SideBarHome />
        </Col>
        <Col md={9}>
          <AccountInfo />
          <br />

          <DevicesConnectedPage />
          <br />

          <LoginsPage />
        </Col>
      </Row>
    </Container>
  );
};

const AccountInfo: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = useAccountHomeStore();

  return (
    <>
      <h1>{__('account.home.title', { name: ctrl?.me?.name })}</h1>
      <br />

      <p>{__('account.home.subtitle')}</p>
      <p>{__('account.home.accessmsg', { username: ctrl?.me?.logins?.map((login: any) => login.username).join(', ') })}</p>
    </>
  );
});

export default HomeAccountPage;
