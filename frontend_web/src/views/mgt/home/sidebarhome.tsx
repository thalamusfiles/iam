import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import modules from '../../modules.config';

function SideBarHome() {
  const __ = useI18N();
  return (
    <div className="sidebar fixed">
      <Form inline>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FontAwesomeIcon size="xs" icon={'search'} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl size="sm" type="text" placeholder={__('menu.search')} />
            </InputGroup>
          </Col>
          <Col xs={2} style={{ padding: 3 }}>
            <FontAwesomeIcon size="xs" icon={'th-large'} /> <FontAwesomeIcon size="xs" icon={'bars'} />
          </Col>
        </Row>
      </Form>

      <div className="title">{__('menu.mgt.activity')}</div>
      <SideBarAction faicon={IconsDef.tokensActive} title={__('menu.mgt.my_tokens_active')} />
      <SideBarAction faicon={IconsDef.history} title={__('menu.mgt.my_logins')} />

      <div className="title">{__('menu.modules.title')}</div>
      {modules.routes.map((route: any, idx) => (
        <SideBarAction key={idx} facolor={route.color} faicon={route.icon} title={__(route.title)} link={route.link} />
      ))}
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
        <Link to={props.link || '/'}>{props.title}</Link>
      </Col>
    </Row>
  );
}

export default SideBarHome;
