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
import ApplicationDefaultList from './defaultlist';

@WMSI18N()
class ApplicationList extends React.Component<{ __: Function }> {
  render() {
    const { __ } = this.props;
    const { list } = historySearch();
    return (
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarEdit />
          </Col>
          {(!list || list === 'application') && (
            <Col md={10}>
              <h1 id="application_about">
                {IconsDef.applications.map((icon) => (
                  <FontAwesomeIcon icon={icon} />
                ))}
                &nbsp; {__!('application.list.title')}
              </h1>
              <p>{__!('application.list.about.description')}</p>

              <ApplicationDefaultList />
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
          onClick={() => historyPush('application_new', { inModal: true, showSave: true })}
        />
        <SideBarAction faicon={IconsDef.goBack} title={__!('actions.back')} variant="outline-secondary" onClick={() => getHistory().goBack()} />

        <div className="title">{__!('menu.lists')}</div>
        <SideBarAction
          faicon={IconsDef.applications[0]}
          title={__!('application.list.title')}
          variant="light"
          onClick={() => historySearchReplace({ list: 'application' })}
        />
      </SideBar>
    );
  }
}

export default ApplicationList;
