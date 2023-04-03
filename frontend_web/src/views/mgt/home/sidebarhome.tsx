import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { getLinkTo } from '../../../commons/route';
import modules from '../../modules.config';

const SideBarHome: React.FC = () => {
  const __ = useI18N();
  return (
    <div className="sidebar">
      <div className="title">{__('menu.mgt.activity')}</div>
      <SideBarAction
        faicon={IconsDef.tokensActive}
        title={__('menu.mgt.my_devices_connected')}
        link={getLinkTo('devices_connected', { inModal: true })}
      />
      <SideBarAction faicon={IconsDef.history} title={__('menu.mgt.my_logins')} link={getLinkTo('logins_history', { inModal: true })} />

      <div className="title">{__('menu.modules.title')}</div>
      {modules.routes.map((route: any, idx) => (
        <SideBarAction key={idx} facolor={route.color} faicon={route.icon} title={__(route.title)} link={route.link} />
      ))}
    </div>
  );
};

const SideBarAction: React.FC<any> = (props) => {
  return (
    <Row className="action">
      <Col xs={1}>
        <FontAwesomeIcon color={props.facolor} size="xs" icon={props.faicon} />
      </Col>
      <Col>
        <Link to={props.link || '/'}>{props.title}</Link>
      </Col>
    </Row>
  );
};

export default SideBarHome;
