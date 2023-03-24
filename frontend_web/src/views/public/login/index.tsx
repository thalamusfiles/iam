import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useParams, useSearchParams } from 'react-router-dom';
import bgRotate01 from '../../../assets/bg_rotate_01.jpeg';
import bgRotate02 from '../../../assets/bg_rotate_02.jpeg';
import bgRotate03 from '../../../assets/bg_rotate_03.jpeg';
import bgRotate04 from '../../../assets/bg_rotate_04.jpeg';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { LoginCtrl, LoginProvider, useLoginStore } from './ctrl';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

const LoginPage: React.FC = () => {
  const ctrl = new LoginCtrl();

  return (
    <LoginProvider value={ctrl}>
      <LoginPageProvided />
    </LoginProvider>
  );
};

const LoginPageProvided: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = useLoginStore();

  const { app } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(
    () =>
      autorun(() => {
        ctrl.setParams(
          //
          app as string,
          searchParams.get('redirectTo'),
          searchParams.get('scope'),
        );
      }),
    [app, ctrl, searchParams],
  );

  return (
    <div style={{ backgroundImage: `url(${bgImg})` }} className="bgImageCover">
      <div style={{ backgroundColor: 'rgba(90,90,90,.8)', width: '100%', padding: 20 }} className="bgImageCover">
        <Row>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} className="text-center text-white mb-5 mt-5">
            <h2>{__('login.title')}</h2>
            <h4>{__('login.subtitle')}</h4>
          </Col>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
            <Col xs={{ span: 10, offset: 1 }}>
              <Card id="login_card" border="info" className="cdShadow">
                <Card.Body>
                  <p>
                    <img src="/logo.png" alt="logo" id="logo" />
                    {__('login.cardindo')}
                  </p>

                  <Form>
                    {ctrl.erroMessage && <Alert variant="danger">{ctrl.erroMessage}</Alert>}

                    {!ctrl.redirectTo && (
                      <Form.Group controlId="login.system">
                        <Form.Label>{__('login.system')}</Form.Label>
                        <Form.Control type="text" value="Root" disabled />
                        <Form.Text className="text-muted">{__('login.system-info')}</Form.Text>
                      </Form.Group>
                    )}

                    <Form.Group controlId="login.username">
                      <Form.Label>{__('login.username')}</Form.Label>
                      <Form.Control
                        placeholder={__('login.typeusername')}
                        type="email"
                        onKeyPress={ctrl.onKeyUpFilter}
                        onChange={ctrl.handleUsername}
                        isInvalid={!!ctrl.erros.username}
                      />
                      <Form.Control.Feedback type="invalid">{__(ctrl.erros.username || '')}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>{__('login.password')}</Form.Label>
                      <Form.Control
                        placeholder={__('login.password') as string}
                        type="password"
                        autoComplete="off"
                        onKeyPress={ctrl.onKeyUpFilter}
                        onChange={ctrl.handlePassword}
                        isInvalid={!!ctrl.erros.password}
                      />
                      <Form.Control.Feedback type="invalid">{__(ctrl.erros.password || '')}</Form.Control.Feedback>
                    </Form.Group>
                  </Form>

                  <Card.Link color="secondary">{__('login.action.forgotpass')}</Card.Link>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col sm={4}>
                      <Button variant="ligth" onClick={ctrl.toRegister}>
                        {__('login.action.register')}
                      </Button>
                    </Col>
                    <Col></Col>
                    <Col sm={4}>
                      <Button variant="primary" onClick={ctrl.toLogin}>
                        <FontAwesomeIcon icon={IconsDef.login} /> {__('login.action.login')}
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
});

export default LoginPage;
