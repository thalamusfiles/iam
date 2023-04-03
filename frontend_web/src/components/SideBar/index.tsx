import React, { PropsWithChildren } from 'react';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';

type SideBarProps = PropsWithChildren<{
  span: number;
}>;

const SideBar: React.FC<SideBarProps> = ({ span, children }) => {
  return (
    <Row className="sidebar">
      <Col md={span}>{children}</Col>
    </Row>
  );
};

export default SideBar;
