import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N, WMSI18N } from '../../../commons/i18';
import { getHistory, historySearch } from '../../../commons/route';
import Loader from '../../../components/Loader';
import SideBar from '../../../components/SideBar';
import { CommonEditStore } from './ctrl';

type GenericEditProps<S extends CommonEditStore> = {
  sideBarSpan?: number;
  ctrl?: S;
  ctrlRef?: (ctrl: S) => void;
  inModal?: boolean; //Se a tela esta sendo exibida dentro de um modal
  match: any;
};

export default abstract class GenericEdit<S extends CommonEditStore> extends React.Component<GenericEditProps<S>, S> {
  ctrl: S;

  constructor(props: any) {
    super(props);
    this.ctrl = props.ctrl;
    this.ctrl.setMatch(this.props.match);
    this.ctrl.setHistory(getHistory());

    if (props.ctrlRef) {
      props.ctrlRef(this.ctrl);
    }
  }

  async componentDidMount() {
    const { inModal } = this.props;

    await this.ctrl.build({ inModal });
  }

  componentWillUnmount() {
    this.ctrl.close();
  }

  sideBar = (<SideBarEdit />);

  render() {
    const __ = useI18N();
    const { sideBarSpan, inModal } = this.props;
    const { show_save } = historySearch();

    return (
      <Provider ctrl={this.ctrl}>
        <Container fluid>
          <Row>
            {!inModal && <Col md={{ span: sideBarSpan || 2 }}>{this.sideBar}</Col>}
            <Col md={inModal ? 12 : 12 - (sideBarSpan || 2)}>
              <Body />
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col md={{ span: 2 }}>
              <Button block variant="outline-secondary" onClick={this.ctrl!.onBack}>
                <FontAwesomeIcon icon={IconsDef.goBack} /> {inModal ? __('actions.close') : __('actions.back')}
              </Button>
            </Col>
            {(!inModal || show_save) && (
              <Col md={{ span: 2 }}>
                <Button block variant="success" onClick={this.ctrl!.onSave}>
                  <FontAwesomeIcon icon={IconsDef.save} /> {__('actions.save')}
                </Button>
              </Col>
            )}
          </Row>
        </Container>
      </Provider>
    );
  }
}

@inject('ctrl')
@observer
class Body extends React.Component<{ ctrl?: CommonEditStore }> {
  render() {
    const { ctrl } = this.props;
    return (
      <>
        <Loader show={ctrl!.loading} vertical center />
        {ctrl!.componentsClass}
      </>
    );
  }
}

@WMSI18N()
@inject('ctrl')
@observer
class SideBarEdit extends React.Component<{ ctrl?: CommonEditStore; __?: Function }> {
  render() {
    const { __, ctrl } = this.props;
    return (
      <SideBar span={2}>
        <div className="title">{__!('menu.actions')}</div>
        <SideBarAction faicon={IconsDef.save} title={__!('actions.save')} variant="outline-success" onClick={ctrl!.onSave} />
        <SideBarAction faicon={IconsDef.goBack} title={__!('actions.back')} variant="outline-secondary" onClick={ctrl!.onBack} />

        <div className="title">{__!('menu.quickaccess')}</div>
        {ctrl!.componentsLoaded.map((comp) => (
          <SideBarAction title={comp.sidebarTitle} link={'#' + comp.name} key={comp.name} />
        ))}
      </SideBar>
    );
  }
}

function SideBarAction(props: any) {
  return (
    <Row className="action">
      <Col xs={1} />
      <Col>
        {props.onClick && (
          <Button variant={props.variant} size="sm" onClick={props.onClick}>
            {props.faicon && <FontAwesomeIcon color={props.facolor} size="xs" icon={props.faicon} />} {props.title}
          </Button>
        )}
        {props.link && <Link to={props.link}>{props.title}</Link>}
      </Col>
    </Row>
  );
}
