import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { WMSI18N } from '../../../../commons/i18';
import { getHistory, historyPush, historySearch, historySearchReplace } from '../../../../commons/route';
import SideBar from '../../../../components/SideBar';
import { SideBarAction } from '../../../../components/SideBar/SideBarAction';
import RegionDefaultList from './defaultlist';

@WMSI18N()
class RegionList extends React.Component<{ __: Function }> {
  render() {
    const { __ } = this.props;
    const { list } = historySearch();
    return (
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarEdit />
          </Col>
          {(!list || list === 'region') && (
            <Col md={10}>
              <h1 id="region_about">
                <FontAwesomeIcon icon={IconsDef.region} />
                &nbsp; {__!('region.list.title')}
              </h1>
              <p>{__!('region.list.about.description')}</p>

              <RegionDefaultList />
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

@WMSI18N()
class SideBarEdit extends React.Component<{ __?: Function }> {
  render() {
    const { __ } = this.props;
    return (
      <SideBar span={2}>
        <div className="title">{__!('menu.actions')}</div>
        <SideBarAction
          faicon={IconsDef.new}
          title={__!('actions.new')}
          variant="outline-primary"
          onClick={() => historyPush('region_new', { inModal: true, showSave: true })}
        />
        <SideBarAction faicon={IconsDef.goBack} title={__!('actions.back')} variant="outline-secondary" onClick={() => getHistory().goBack()} />

        <div className="title">{__!('menu.lists')}</div>
        <SideBarAction
          faicon={IconsDef.region}
          title={__!('region.list.title')}
          variant="light"
          onClick={() => historySearchReplace({ list: 'region' })}
        />
      </SideBar>
    );
  }
}

export default RegionList;
