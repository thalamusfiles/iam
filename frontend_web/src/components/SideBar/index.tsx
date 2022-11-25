import React from 'react';
import Col from 'react-bootstrap/Col';

type SideBarProps = {
  span: number;
};

const SideBar: React.FC<SideBarProps> = ({ span, children }) => {
  return (
    <div className="sidebar fixed">
      <Col md={span}>{children}</Col>
    </div>
  );
};

export default SideBar;
