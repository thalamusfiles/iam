import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from 'react-bootstrap/Button';
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
import { historyPush, historySearch } from '../../../commons/route';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

@WMSI18N()
class RegisterPage extends React.Component<{ __: Function; match: any }> {
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
      this.register();
    }
  };

  handleUsername = (e: any) => {
    this.setState({ username: e.target.value });
  };

  handlePassword = (e: any) => {
    this.setState({ password: e.target.value });
  };

  toLogin = () => {
    const { region, app } = this.props.match.params;
    historyPush('login', { region, app });
  };

  register = () => {
    historyPush('home_account');
  };

  render() {
    const { __ } = this.props;
    const { erros } = this.state;

    return (
      <div style={{ backgroundImage: `url(${bgImg})` }} className="bgImageCover">
        <div style={{ backgroundColor: 'rgba(90,90,90,.8)', width: '100%', padding: 20 }} className="bgImageCover">
          <Row>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} className="text-center text-white mb-5 mt-5">
              <h2>{__('register.title')}</h2>
              <h4>{__('register.subtitle')}</h4>
            </Col>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
              <Col xs={{ span: 10, offset: 1 }}>
                <Card id="login_card" border="info" className="cdShadow">
                  <Card.Body>
                    <p>
                      <img src="/logo.png" alt="logo" id="logo" />
                      {__('register.cardindo')}
                    </p>

                    <Form.Group controlId="validationCustom01">
                      <Form.Label>{__('register.username')}</Form.Label>
                      <Form.Control
                        placeholder="Enter your user name, code or email"
                        type="username"
                        onKeyPress={this.onKeyUpFilter}
                        onChange={this.handleUsername}
                        isInvalid={!!erros.username}
                      />
                      <Form.Control.Feedback type="invalid">{erros.username}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="validationCustom01">
                      <Form.Label>{__('register.email')}</Form.Label>
                      <Form.Control
                        placeholder="Enter your email"
                        type="email"
                        onKeyPress={this.onKeyUpFilter}
                        onChange={this.handleUsername}
                        isInvalid={!!erros.username}
                      />
                      <Form.Control.Feedback type="invalid">{erros.username}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>{__('register.password')}</Form.Label>
                          <Form.Control
                            placeholder={__('register.password') as string}
                            type="password"
                            autoComplete="off"
                            onKeyPress={this.onKeyUpFilter}
                            onChange={this.handlePassword}
                            isInvalid={!!erros.password}
                          />
                          <Form.Control.Feedback type="invalid">{erros.password}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>{__('register.passwordcheck')}</Form.Label>
                          <Form.Control
                            placeholder={__('register.passwordcheck') as string}
                            type="password"
                            autoComplete="off"
                            onKeyPress={this.onKeyUpFilter}
                            onChange={this.handlePassword}
                            isInvalid={!!erros.password}
                          />
                          <Form.Control.Feedback type="invalid">{erros.password}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <Row>
                      <Col sm={6}>
                        <Button size="sm" variant="ligth" onClick={this.toLogin} block>
                          {__('register.action.tologin')}
                        </Button>
                      </Col>
                      <Col></Col>
                      <Col sm={5}>
                        <Button variant="primary" onClick={this.register} block>
                          <FontAwesomeIcon icon={IconsDef.save} /> {__('login.action.register')}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default RegisterPage;
