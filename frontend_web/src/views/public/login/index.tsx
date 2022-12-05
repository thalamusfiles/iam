import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import bgRotate01 from '../../../assets/bg_rotate_01.jpeg';
import bgRotate02 from '../../../assets/bg_rotate_02.jpeg';
import bgRotate03 from '../../../assets/bg_rotate_03.jpeg';
import bgRotate04 from '../../../assets/bg_rotate_04.jpeg';
import { IconsDef } from '../../../commons/consts';
import { WMSI18N } from '../../../commons/i18';
import { historySearch } from '../../../commons/route';
import UserContext from '../../../store/userContext';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

@WMSI18N()
class LoginPage extends React.Component<{ __: Function }> {
  state = {
    erros: {
      username: null,
      password: null,
    },
    redirectTo: null as null | string,
    username: '',
    password: '',
  };

  constructor(props: any) {
    super(props);

    const urlSearch = historySearch();
    this.state.redirectTo = urlSearch.redirectTo as string;
  }

  onKeyUpFilter = (e: any) => {
    if (e.charCode === 13) {
      this.login();
    }
  };

  handleUsername = (e: any) => {
    this.setState({ username: e.target.value });
  };

  handlePassword = (e: any) => {
    this.setState({ password: e.target.value });
  };

  login = () => {
    UserContext.login(this.state.username, this.state.password).catch((error) => {
      this.setState({
        erros: {
          username: 'User not found',
          password: 'Invalid pass',
        },
      });
    });
  };

  render() {
    const { __ } = this.props;
    const { redirectTo, erros } = this.state;

    return (
      <div style={{ backgroundImage: `url(${bgImg})` }} className="bgImageCover">
        <div style={{ backgroundColor: 'rgba(50,50,50,.8)', width: '100%', padding: 20 }} className="bgImageCover">
          <Row>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} className="text-center text-white mb-5 mt-5">
              <h2>{__('login.title')}</h2>
              <h4>{__('login.subtitle')}</h4>
            </Col>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
              <Card border="info" className="cdShadow">
                <Card.Body>
                  {!redirectTo && (
                    <Row>
                      <Col>
                        <Form.Group controlId="validationCustom01">
                          <Form.Label>{__('login.region')}</Form.Label>
                          <Form.Control type="text" value="Global System" disabled />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="validationCustom01">
                          <Form.Label>{__('login.system')}</Form.Label>
                          <Form.Control type="text" value="Root" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                  <Form.Group controlId="validationCustom01">
                    <Form.Label>{__('login.username')}</Form.Label>
                    <Form.Control
                      placeholder="Enter your user name, code or email"
                      type="email"
                      onKeyPress={this.onKeyUpFilter}
                      onChange={this.handleUsername}
                      isInvalid={!!erros.username}
                    />
                    <Form.Control.Feedback type="invalid">{erros.username}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{__('login.password')}</Form.Label>
                    <Form.Control
                      placeholder={__('login.password') as string}
                      type="password"
                      autoComplete="off"
                      onKeyPress={this.onKeyUpFilter}
                      onChange={this.handlePassword}
                      isInvalid={!!erros.password}
                    />
                    <Form.Control.Feedback type="invalid">{erros.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col>
                      <Card.Link color="primary" onClick={this.login}>
                        <FontAwesomeIcon icon={IconsDef.save} /> {__('login.action.login')}
                      </Card.Link>
                    </Col>
                    <Col></Col>
                    <Col>
                      <Card.Link color="primary" onClick={this.login}>
                        <FontAwesomeIcon icon={IconsDef.new} /> {__('login.action.register')}
                      </Card.Link>
                      <Card.Link color="secondary" onClick={this.login}>
                        <FontAwesomeIcon icon={IconsDef.goBack} /> {__('actions.back')}
                      </Card.Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default LoginPage;
