import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';

function SideBarHome() {
  const __ = useI18N();
  return (
    <div className="sidebar">
      <div className="title">{__('menu.mgt.activity')}</div>
      <SideBarAction faicon={IconsDef.tokensActive} title={__('menu.mgt.my_devices_connected')} />
      <SideBarAction faicon={IconsDef.history} title={__('menu.mgt.my_logins')} />
    </div>
  );
}

function SideBarAction(props: any) {
  return (
    <Row className="action">
      <Col xs={1}>
        <FontAwesomeIcon color={props.facolor} size="xs" icon={props.faicon} />
      </Col>
      <Col>
        <Link to={props.link || '#'}>{props.title}</Link>
      </Col>
    </Row>
  );
}

export default SideBarHome;
