import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { useI18N } from '../../../../commons/i18';
import { historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import { SideBar } from '../../../../components/SideBar/SideBar';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import ApplicationDefaultList from './defaultlist';

export const ApplicationList: React.FC = () => {
  const __ = useI18N();
  const { list } = historySearch();

  return (
    <Container fluid>
      <Row>
        <SideBarEdit />
        {(!list || list === 'application') && (
          <Col md={10}>
            <h1 id="application_about">
              {IconsDef.applications.map((icon, idx) => (
                <FontAwesomeIcon icon={icon} key={idx} />
              ))}
              &nbsp; {__('application.list.title')}
            </h1>
            <p>{__('application.list.about.description')}</p>

            <ApplicationDefaultList />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export const SideBarEdit: React.FC = () => {
  const __ = useI18N();

  return (
    <SideBar colSize={2}>
      <div className="title">{__('menu.actions')}</div>
      <SideBarAction
        faicon={IconsDef.new}
        title={__('actions.new')}
        variant="outline-primary"
        onClick={() => historyPush('application_new', { inModal: true, showSave: true })}
      />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={() => historyPush(-1)} />

      <div className="title">{__('menu.lists')}</div>
      <SideBarAction
        faicon={IconsDef.applications[0]}
        title={__('application.list.title')}
        variant="light"
        onClick={() => historySearchReplace({ list: 'application' })}
      />
    </SideBar>
  );
};

export default ApplicationList;
