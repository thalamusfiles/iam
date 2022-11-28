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
import PersonDefaultList from './defaultlist';

@WMSI18N()
class PersonList extends React.Component<{ __: Function }> {
  render() {
    const { __ } = this.props;
    const { list } = historySearch();
    return (
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarEdit />
          </Col>
          {(!list || list === 'person') && (
            <Col md={10}>
              <h1 id="person_about">
                {IconsDef.person.map((icon) => (
                  <FontAwesomeIcon icon={icon} />
                ))}
                &nbsp; {__!('person.list.title')}
              </h1>
              <p>{__!('person.list.about.description')}</p>

              <PersonDefaultList />
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
        <SideBarAction faicon={IconsDef.new} title={__!('actions.new')} variant="outline-primary" onClick={() => historyPush('person_new')} />
        <SideBarAction faicon={IconsDef.goBack} title={__!('actions.back')} variant="outline-secondary" onClick={() => getHistory().goBack()} />

        <div className="title">{__!('menu.lists')}</div>
        <SideBarAction
          faicon={IconsDef.person[0]}
          title={__!('person.list.title')}
          variant="light"
          onClick={() => historySearchReplace({ list: 'person' })}
        />
        <SideBarAction
          faicon={IconsDef.permissions}
          title={__!('person.permissions.list.title')}
          variant="light"
          onClick={() => historySearchReplace({ list: 'person_permissions' })}
        />
      </SideBar>
    );
  }
}

export default PersonList;
