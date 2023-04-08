import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historySearch } from '../../../commons/route';
import Loader from '../../../components/Loader';
import { SideBar } from '../../../components/SideBar/SideBar';
import { SideBarAction } from '../../../components/SideBar/SideBarAction';
import { useCommonEditStore } from './ctrl';

export type GenericEditProps = {
  inModal?: boolean; //Se a tela esta sendo exibida dentro de um modal
};

const GenericEdit: React.FC<GenericEditProps> = observer(({ inModal }) => {
  const ctrl = useCommonEditStore();
  const __ = useI18N();
  const { show_save } = historySearch();

  useEffect(() => {
    ctrl.build({ inModal });

    return () => {
      ctrl.close();
    };
  });

  return (
    <Container fluid>
      <Row>
        {!inModal && <GenericSideBarEdit />}
        <Col md={inModal ? 12 : 10}>
          <GenericBody />
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col md={{ span: 2 }}>
          <Button variant="outline-secondary" onClick={ctrl!.onBack}>
            <FontAwesomeIcon icon={IconsDef.goBack} /> {inModal ? __('actions.close') : __('actions.back')}
          </Button>
        </Col>
        {(!inModal || show_save) && (
          <Col md={{ span: 2 }}>
            <Button variant="success" onClick={ctrl!.onSave}>
              <FontAwesomeIcon icon={IconsDef.save} /> {__('actions.save')}
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
});

const GenericBody: React.FC = observer(() => {
  const ctrl = useCommonEditStore();

  return (
    <>
      <Loader show={ctrl!.loading} vertical center />
      {ctrl!.componentsClass}
    </>
  );
});

const GenericSideBarEdit: React.FC = () => {
  const ctrl = useCommonEditStore();
  const __ = useI18N();

  return (
    <SideBar colSize={2}>
      <div className="title">{__('menu.actions')}</div>

      <SideBarAction faicon={IconsDef.save} title={__('actions.save')} variant="outline-success" onClick={ctrl!.onSave} />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={ctrl!.onBack} />

      <div className="title">{__('menu.quickaccess')}</div>

      {ctrl!.componentsLoaded.map((comp) => (
        <SideBarAction title={comp.sidebarTitle} link={'#' + comp.name} key={comp.name} />
      ))}
    </SideBar>
  );
};

export default GenericEdit;
