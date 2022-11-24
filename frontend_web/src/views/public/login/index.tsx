import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import bgRotate01 from '../../../assets/bg_rotate_01.jpeg';
import bgRotate02 from '../../../assets/bg_rotate_02.jpeg';
import bgRotate03 from '../../../assets/bg_rotate_03.jpeg';
import bgRotate04 from '../../../assets/bg_rotate_04.jpeg';
import { WMSI18N } from '../../../commons/i18';
import UserContext from '../../../store/userContext';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

@WMSI18N()
class LoginPage extends React.Component<{ __: Function }> {
  state = {
    erros: {
      username: null,
      password: null,
    },
    username: '',
    password: '',
  };

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
    const { erros } = this.state;

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
                  <Form.Group controlId="validationCustom01">
                    <Form.Label>{__('login.system')}</Form.Label>
                    <Form.Control type="text" value="Global System" disabled />
                  </Form.Group>

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

                  <Card.Link color="info" onClick={this.login}>
                    {__('login.action.login')}
                  </Card.Link>
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
