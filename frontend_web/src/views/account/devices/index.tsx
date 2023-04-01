import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Route, Routes } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import { DevicesConnectedCtx, DevicesConnectedProvider, useDevicesConnectedStore } from './ctrl';

const DevicesConnectedPage: React.FC = () => {
  const ctrl = new DevicesConnectedCtx();

  useEffect(() => {
    ctrl.init();
  });

  return (
    <DevicesConnectedProvider value={ctrl}>
      <Routes>
        <Route path={'/modal/alldevices'} element={<DevicesConnectedModalProvided />} />
      </Routes>

      <DevicesConnectedPageProvided />
    </DevicesConnectedProvider>
  );
};

/**
 * Listagem com os dispositivos conectados
 * @returns
 */
const DevicesConnectedPageProvided: React.FC = () => {
  const __ = useI18N();

  return (
    <>
      <h2 id="devices_about">
        <FontAwesomeIcon icon={IconsDef.tokensActive} /> {__('devices.title')}
      </h2>
      <p>{__('devices.description')}</p>
      <DevicesConnectedTable showAll={false} />
    </>
  );
};

/**
 * Modal com todos os dispositivos conectados
 * @returns
 */
const DevicesConnectedModalProvided: React.FC = () => {
  const __ = useI18N();

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={true} onHide={() => historyPush(-1)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={IconsDef.tokensActive} /> {__('devices.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{__('devices.description')}</p>

        <DevicesConnectedTable showAll={true} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => historyPush(-1)}>{__('actions.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

const pageLimite = 5;
const DevicesConnectedTable: React.FC<{ showAll: boolean }> = observer(({ showAll }) => {
  const __ = useI18N();
  const ctrl = useDevicesConnectedStore();

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>{__('devices.device')}</th>
          <th>{__('devices.logged_since')}</th>
        </tr>
      </thead>
      <tbody>
        {ctrl?.devices
          .filter((_, idx) => showAll || idx < pageLimite)
          .map((on, idx) => (
            <tr key={idx}>
              <td>{on.userAgent}</td>
              <td>{on.createdAt}</td>
            </tr>
          ))}
        {
          // Com mais de 5 resultados
          !showAll && ctrl?.devices.length > pageLimite && (
            <tr>
              <td>{__('info.thereXmorerecords', { number: ctrl?.devices.length - pageLimite })}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="float-end" onClick={() => historyPush('/alldevices', { inModal: true })}>
                  {__('actions.showall')}
                </Button>
              </td>
            </tr>
          )
        }
      </tbody>
    </Table>
  );
});

export default DevicesConnectedPage;
