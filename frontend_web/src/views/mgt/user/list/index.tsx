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
import UserDefaultList from './defaultlist';

export const UserList: React.FC = () => {
  const __ = useI18N();
  const { list } = historySearch();

  return (
    <Container fluid>
      <Row>
        <SideBarEdit />
        {(!list || list === 'user') && (
          <Col md={10}>
            <h1 id="user_about">
              {IconsDef.user.map((icon, idx) => (
                <FontAwesomeIcon icon={icon} key={idx} />
              ))}
              &nbsp; {__('user.list.title')}
            </h1>
            <p>{__('user.list.about.description')}</p>

            <UserDefaultList />
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
      <SideBarAction faicon={IconsDef.new} title={__('actions.new')} variant="outline-primary" onClick={() => historyPush('user_new')} />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={() => historyPush(-1)} />

      <div className="title">{__('menu.lists')}</div>
      <SideBarAction faicon={IconsDef.user[0]} title={__('user.list.title')} variant="light" onClick={() => historySearchReplace({ list: 'user' })} />
      <SideBarAction
        faicon={IconsDef.permissions}
        title={__('user.permissions.list.title')}
        variant="light"
        onClick={() => historySearchReplace({ list: 'user_permissions' })}
      />
    </SideBar>
  );
};

export default UserList;
