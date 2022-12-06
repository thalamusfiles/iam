import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getHistory, historySearch } from '../../commons/route';

export function InModal(props: any) {
  const urlSearch = historySearch();

  const [smShow, setSmShow] = useState(false);
  setTimeout(() => setSmShow(true), 100);
  const handleClose = () => !urlSearch.show_save && getHistory().goBack();

  return (
    <Modal show={smShow} size="xl" onHide={handleClose}>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}
