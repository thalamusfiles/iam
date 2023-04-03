import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { useI18N } from '../../../../commons/i18';
import { historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import RoleDefaultList from './defaultlist';

export const RoleList: React.FC = () => {
  const __ = useI18N();
  const { list } = historySearch();

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <SideBarEdit />
        </Col>
        {(!list || list === 'role') && (
          <Col md={10}>
            <h1 id="role_about">
              <FontAwesomeIcon icon={IconsDef.roles} />
              &nbsp; {__('role.list.title')}
            </h1>
            <p>{__('role.list.about.description')}</p>

            <RoleDefaultList />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export const SideBarEdit: React.FC = () => {
  const __ = useI18N();

  return (
    <>
      <div className="title">{__('menu.actions')}</div>
      <SideBarAction
        faicon={IconsDef.new}
        title={__('actions.new')}
        variant="outline-primary"
        onClick={() => historyPush('role_new', { inModal: true, showSave: true })}
      />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={() => historyPush(-1)} />

      <div className="title">{__('menu.lists')}</div>
      <SideBarAction faicon={IconsDef.roles} title={__('role.list.title')} variant="light" onClick={() => historySearchReplace({ list: 'role' })} />
    </>
  );
};

export default RoleList;
