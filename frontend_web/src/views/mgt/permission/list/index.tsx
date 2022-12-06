import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { WMSI18N } from '../../../../commons/i18';
import { getHistory, historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import SideBar from '../../../../components/SideBar';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import PermissionDefaultList from './defaultlist';

@WMSI18N()
class PermissionList extends React.Component<{ __: Function }> {
  render() {
    const { __ } = this.props;
    const { list } = historySearch();
    return (
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarEdit />
          </Col>
          {(!list || list === 'permission') && (
            <Col md={10}>
              <h1 id="permission_about">
                <FontAwesomeIcon icon={IconsDef.permissions} />
                &nbsp; {__!('permission.list.title')}
              </h1>
              <p>{__!('permission.list.about.description')}</p>

              <PermissionDefaultList />
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

@WMSI18N()
class SideBarEdit extends React.Component<{ __?: Function }> {
  render() {
    const { __ } = this.props;
    return (
      <SideBar span={2}>
        <div className="title">{__!('menu.actions')}</div>
        <SideBarAction
          faicon={IconsDef.new}
          title={__!('actions.new')}
          variant="outline-primary"
          onClick={() => historyPush('permission_new', { inModal: true, showSave: true })}
        />
        <SideBarAction faicon={IconsDef.goBack} title={__!('actions.back')} variant="outline-secondary" onClick={() => getHistory().goBack()} />

        <div className="title">{__!('menu.lists')}</div>
        <SideBarAction
          faicon={IconsDef.permissions}
          title={__!('permission.list.title')}
          variant="light"
          onClick={() => historySearchReplace({ list: 'permission' })}
        />
      </SideBar>
    );
  }
}

export default PermissionList;
