import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { WMSI18N } from '../../../../commons/i18';
import SideBar from '../../../../components/SideBar';
import PersonDefaultList from './defaultlist';

@WMSI18N()
class PersonList extends React.Component<{ __: Function }> {
  render() {
    const { __ } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBar span={2}>A</SideBar>
          </Col>
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
        </Row>
      </Container>
    );
  }
}

export default PersonList;
