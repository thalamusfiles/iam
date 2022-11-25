import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PersonDefaultList from './defaultlist';

const PersonList = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2}>aa</Col>
        <Col md={10}>
          <PersonDefaultList />
        </Col>
      </Row>
    </Container>
  );
};

export default PersonList;
