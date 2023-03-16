import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { ColorsDef, IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import ListTile from '../../../components/listtile';
import SideBarHome from './sidebarhome';

function Home() {
  return (
    <div className="dashboard">
      <Container fluid>
        <Row>
          <Col md={{ span: 3, offset: 1 }}>
            <SideBarHome />
          </Col>
          <Col md={8} className="dashboard-content">
            <QuickAccess />
            <Register />
            <Systems />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function QuickAccess() {
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
}

function Register() {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.mgt.register')}</h1>
      <Row>
        <Col sm={6}>
          <ListTile
            variant={ColorsDef.personVariant}
            faicon={IconsDef.person}
            title={__('menu.mgt.person')}
            onClick={() => historyPush('person_list')}
          />
        </Col>
        <Col sm={6}>
          <ListTile
            variant={ColorsDef.permissionsVariant}
            faicon={IconsDef.permissions}
            title={__('menu.mgt.permissions')}
            onClick={() => historyPush('permission_list')}
          />
        </Col>
        <Col sm={6}>
          <ListTile variant={ColorsDef.rolesVariant} faicon={IconsDef.roles} title={__('menu.mgt.roles')} onClick={() => historyPush('role_list')} />
        </Col>
      </Row>
    </>
  );
}

function Systems() {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.mgt.systems')}</h1>
      <Row>
        <Col sm={6}>
          <ListTile
            variant={ColorsDef.regionVariant}
            faicon={IconsDef.region}
            title={__('menu.mgt.region')}
            onClick={() => historyPush('region_list')}
          />
        </Col>
        <Col sm={6}>
          <ListTile
            variant={ColorsDef.applicationsVariant}
            faicon={IconsDef.applications}
            title={__('menu.mgt.applications')}
            onClick={() => historyPush('application_list')}
          />
        </Col>
      </Row>
    </>
  );
}

export default Home;
