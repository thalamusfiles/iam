import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { useI18N } from '../../../../commons/i18';
import { historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import PersonDefaultList from './defaultlist';

export const PersonList: React.FC = () => {
  const __ = useI18N();
  const { list } = historySearch();

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <SideBarEdit />
        </Col>
        {(!list || list === 'person') && (
          <Col md={10}>
            <h1 id="person_about">
              {IconsDef.person.map((icon) => (
                <FontAwesomeIcon icon={icon} />
              ))}
              &nbsp; {__('person.list.title')}
            </h1>
            <p>{__('person.list.about.description')}</p>

            <PersonDefaultList />
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
      <SideBarAction faicon={IconsDef.new} title={__('actions.new')} variant="outline-primary" onClick={() => historyPush('person_new')} />
      <SideBarAction faicon={IconsDef.goBack} title={__('actions.back')} variant="outline-secondary" onClick={() => historyPush(-1)} />

      <div className="title">{__('menu.lists')}</div>
      <SideBarAction
        faicon={IconsDef.person[0]}
        title={__('person.list.title')}
        variant="light"
        onClick={() => historySearchReplace({ list: 'person' })}
      />
      <SideBarAction
        faicon={IconsDef.permissions}
        title={__('person.permissions.list.title')}
        variant="light"
        onClick={() => historySearchReplace({ list: 'person_permissions' })}
      />
    </>
  );
};

export default PersonList;
