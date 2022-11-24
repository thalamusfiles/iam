import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export function InModal(props: any) {
  const [smShow, setSmShow] = useState(false);
  setTimeout(() => setSmShow(true), 100);

  return (
    <Modal show={smShow} size="xl">
      <Modal.Body>
        {props.children}
      </Modal.Body>
    </Modal>
  );
}