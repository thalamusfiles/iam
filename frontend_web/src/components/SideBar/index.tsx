import React, { PropsWithChildren } from 'react';
import Col from 'react-bootstrap/Col';

type SideBarProps = PropsWithChildren<{
  span: number;
}>;

const SideBar: React.FC<SideBarProps> = ({ span, children }) => {
  return (
    <div className="sidebar fixed">
      <Col md={span}>{children}</Col>
    </div>
  );
};

export default SideBar;
