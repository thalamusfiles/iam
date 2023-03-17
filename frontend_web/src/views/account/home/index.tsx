import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useI18N } from '../../../commons/i18';
import DevicesConnectedPage from '../devices';
import LoginsPage from '../logins';
import SideBarHome from './sidebarhome';

const HomeAccount: React.FC<{}> = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 3 }}>
          <SideBarHome />
        </Col>
        <Col md={8}>
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

const AccountInfo: React.FC<{}> = () => {
  const __ = useI18N();
  const context = {} as any;
  return (
    <>
      <h1>{__!('account.home.title', { name: context?.user?.name })}</h1>
      <br />

      <p>{__!('account.home.subtitle')}</p>
      <p>{__!('account.home.accessmsg', { username: context?.user?.username, email: context?.user?.email })}</p>
    </>
  );
};

export default HomeAccount;
