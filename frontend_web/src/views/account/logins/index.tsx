import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Route, Routes } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import { LoginsCtx, LoginsProvider, useLoginStore } from './ctrl';

const LoginsPage: React.FC = () => {
  const ctrl = new LoginsCtx();

  useEffect(() => {
    ctrl.init();
  });

  return (
    <LoginsProvider value={ctrl}>
      <Routes>
        <Route path={'/modal/alllogins'} element={<LoginsPageModalProvided />} />
      </Routes>

      <LoginsPageProvided />
    </LoginsProvider>
  );
};

/**
 * Listagem com dos logins realizados
 * @returns
 */
const LoginsPageProvided: React.FC = () => {
  const __ = useI18N();

  return (
    <>
      <h2 id="logins_about">
        <FontAwesomeIcon icon={IconsDef.history} /> {__('logins.title')}
      </h2>
      <p>{__('logins.description')}</p>
      <LoginsTable showAll={false} />
    </>
  );
};

/**
 * Modal com todos os logins realizados
 * @returns
 */
const LoginsPageModalProvided: React.FC = () => {
  const __ = useI18N();

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={true} onHide={() => historyPush(-1)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={IconsDef.history} /> {__('logins.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{__('logins.description')}</p>

        <LoginsTable showAll={true} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => historyPush(-1)}>{__('actions.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

const pageLimite = 5;
const LoginsTable: React.FC<{ showAll: boolean }> = observer(({ showAll }) => {
  const __ = useI18N();
  const ctrl = useLoginStore();

  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>{__('logins.device')}</th>
          <th>{__('logins.to_application')}</th>
          <th>{__('logins.login_at')}</th>
        </tr>
      </thead>
      <tbody>
        {ctrl?.logins
          .filter((_, idx) => showAll || idx < pageLimite)
          .map((login, idx) => (
            <tr key={idx}>
              <td>{login.userAgent}</td>
              <td>{login.applicationName}</td>
              <td>{login.createdAt}</td>
            </tr>
          ))}
        {
          // Com mais de 5 resultados
          !showAll && ctrl?.logins.length > pageLimite && (
            <tr>
              <td colSpan={2}>{__('info.thereXmorerecords', { number: ctrl?.logins.length - pageLimite })}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="float-end" onClick={() => historyPush('/alllogins', { inModal: true })}>
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

export default LoginsPage;
