import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { useI18N } from '../../../../commons/i18';
import { historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import PermissionDefaultList from './defaultlist';

export const PermissionList: React.FC = () => {
  const __ = useI18N();
  const { list } = historySearch();

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <SideBarEdit />
        </Col>
        {(!list || list === 'permission') && (
          <Col md={10}>
            <h1 id="permission_about">
              <FontAwesomeIcon icon={IconsDef.permissions} />
              &nbsp; {__('permission.list.title')}
            </h1>
            <p>{__('permission.list.about.description')}</p>

            <PermissionDefaultList />
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
        onClick={() => historyPush('permission_new', { inModal: true, showSave: true })}
      />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={() => historyPush(-1)} />

      <div className="title">{__('menu.lists')}</div>
      <SideBarAction
        faicon={IconsDef.permissions}
        title={__('permission.list.title')}
        variant="light"
        onClick={() => historySearchReplace({ list: 'permission' })}
      />
    </>
  );
};

export default PermissionList;
