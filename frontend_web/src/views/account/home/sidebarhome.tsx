import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';

const SideBarHome: React.FC = () => {
  const __ = useI18N();
  return (
    <div className="sidebar">
      <div className="title">{__('menu.mgt.activity')}</div>
      <SideBarAction
        faicon={IconsDef.tokensActive}
        title={__('menu.mgt.my_devices_connected')}
        onClick={() => historyPush('/alldevices', { inModal: true })}
      />
      <SideBarAction faicon={IconsDef.history} title={__('menu.mgt.my_logins')} onClick={() => historyPush('/alllogins', { inModal: true })} />
    </div>
  );
};

const SideBarAction: React.FC<{ title: string; link?: string; faicon: IconName; facolor?: string; onClick?: () => void }> = (props) => {
  return (
    <Row className="action" onClick={props.onClick}>
      <Col xs={1}>
        <FontAwesomeIcon color={props.facolor} size="xs" icon={props.faicon} />
      </Col>
      <Col>
        <Link to={props.link || '#'}>{props.title}</Link>
      </Col>
    </Row>
  );
};

export default SideBarHome;
