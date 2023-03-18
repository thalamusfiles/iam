import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { TableHead } from './types/TableHead';

export const TableResizer: React.FC<{ head: TableHead }> = ({ head }) => {
  const [screenX, setScreenX] = useState(0);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setScreenX(e.screenX);
  };
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const diff = e.screenX - screenX;
    const parentWidth = ReactDOM.findDOMNode(this)?.parentElement?.offsetWidth;
    head.maxWidth = (head.maxWidth || parentWidth || 0) + diff;
  };

  return (
    <div className="float-right">
      <div className="table-resizer" draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd} />
    </div>
  );
};
