import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { ColorsDef, IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCard from '../../../components/Card/card';
import TCardTile from '../../../components/Card/card-tile';
import SideBarHome from './sidebarhome';

const Home: React.FC = () => {
  return (
    <div className="dashboard">
      <Container fluid>
        <Row>
          <Col md={{ span: 2, offset: 1 }}>
            <SideBarHome />
          </Col>
          <Col md={9} className="dashboard-content">
            <QuickAccess />
            <Register />
            <Systems />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const QuickAccess: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <OverlayTrigger placement={'left'} overlay={<Tooltip id={`importtt`}>{__('menu.mgt.my_devices_connected')}</Tooltip>}>
        <Button variant="primary" onClick={() => historyPush('devices_connected', { inModal: true })}>
          <FontAwesomeIcon icon={IconsDef.tokensActive} />
          &nbsp;
          {__('menu.mgt.my_devices_connected')}
        </Button>
      </OverlayTrigger>
      &nbsp;
      <OverlayTrigger placement={'left'} overlay={<Tooltip id={`emptycntrtt`}>{__('menu.mgt.my_logins')}</Tooltip>}>
        <Button variant="warning" onClick={() => historyPush('logins_history', { inModal: true })}>
          <FontAwesomeIcon icon={IconsDef.history} />
          &nbsp;
          {__('menu.mgt.my_logins')}
        </Button>
      </OverlayTrigger>
      <br />
      <br />
    </>
  );
};

const Register: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.mgt.register')}</h1>
      <Row>
        <Col sm={12} lg={4}>
          <TCard
            border={ColorsDef.userVariant}
            faicon={IconsDef.user}
            title={__('menu.mgt.user')}
            subtitle={__('menu.mgt.user')}
            onClick={() => historyPush('user_list')}
          >
            <Card.Body>
              <Card.Text>{__('menu.mgt.user_description')}</Card.Text>
            </Card.Body>
          </TCard>
        </Col>
        <Col sm={12} lg={4}>
          <TCard
            border={ColorsDef.rolesVariant}
            faicon={IconsDef.roles}
            title={__('menu.mgt.roles')}
            subtitle={__('menu.mgt.roles')}
            onClick={() => historyPush('role_list')}
          >
            <Card.Body>
              <Card.Text>{__('menu.mgt.roles_description')}</Card.Text>
            </Card.Body>
          </TCard>
        </Col>
        <Col sm={12} lg={4}>
          <TCard
            border={ColorsDef.permissionsVariant}
            faicon={IconsDef.permissions}
            title={__('menu.mgt.permissions')}
            subtitle={__('menu.mgt.permissions')}
            onClick={() => historyPush('permission_list')}
          >
            <Card.Body>
              <Card.Text>{__('menu.mgt.permissions_description')}</Card.Text>
            </Card.Body>
          </TCard>
        </Col>
      </Row>
    </>
  );
};

const Systems: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.mgt.systems')}</h1>
      <Row>
        <Col sm={6}>
          <TCardTile
            variant={ColorsDef.applicationsVariant}
            faicon={IconsDef.applications}
            title={__('menu.mgt.applications')}
            subtitle={__('menu.mgt.applications')}
            onClick={() => historyPush('application_list')}
          />
        </Col>
      </Row>
    </>
  );
};

export default Home;
