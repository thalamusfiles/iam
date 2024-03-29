import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import Footer from '../../../components/Footer';
import { LoginCtrl, LoginProvider, useLoginStore } from './ctrl';
import PermissionInfoModal from './permissions.modal';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

const LoginPage: React.FC = () => {
  const ctrl = new LoginCtrl();

  const { app } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    ctrl.setParams(
      //
      app as string,
      searchParams.get('response_type'),
      searchParams.get('redirect_uri'),
      searchParams.get('scope'),
      searchParams.get('state'),
      searchParams.get('code_challenge'),
      searchParams.get('code_challenge_method'),
    );
  });

  return (
    <LoginProvider value={ctrl}>
      <LoginPageProvided />
    </LoginProvider>
  );
};

const LoginPageProvided: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = useLoginStore();

  return (
    <div style={{ backgroundImage: `url(${bgImg})` }} className="bgImageCover">
      <div style={{ backgroundColor: 'rgba(90,90,90,.8)', width: '100%', padding: 20 }} className="bgImageCover">
        <PermissionInfoModal ctrl={ctrl} />

        <Row>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} className="text-center text-white mb-5 mt-5">
            <h2>{__('login.title')}</h2>
            <h4>{__('login.subtitle')}</h4>
          </Col>
        </Row>
        <Row>
          <Col xxl={{ span: 4, offset: 4 }} lg={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }} xs={12}>
            <Col xs={{ span: 10, offset: 1 }}>
              <Card id="login_card" border="info" className="cdShadow">
                <Card.Body>
                  <p>
                    <img src="/logo.png" alt="logo" id="logo" />
                    {__('login.cardindo')}
                  </p>
                  <Form>
                    {!!ctrl.erroMessages?.length && (
                      <Alert variant="danger">
                        {ctrl.erroMessages.map((msg) => (
                          <>
                            {__(msg)} <br />
                          </>
                        ))}
                      </Alert>
                    )}

                    <OldLoginComp />

                    <Form.Group controlId="login.application">
                      <Form.Label>{__('login.application')}</Form.Label>
                      <Form.Control type="text" defaultValue={ctrl.appInfo?.name} disabled />
                      <Form.Text className="text-muted">{__('login.application-info')}</Form.Text>
                    </Form.Group>

                    <p onClick={() => ctrl.showPermissionModal()}>
                      <br />
                      <strong>{__('login.permissions-info')}</strong>
                    </p>

                    <Form.Group controlId="login.username">
                      <Form.Label>{__('login.username')}</Form.Label>
                      <Form.Control
                        placeholder={__('login.typeusername')}
                        type="username"
                        onKeyPress={ctrl.onKeyUpFilter}
                        onChange={ctrl.handleUsername}
                        isInvalid={!!ctrl.erros.username}
                      />
                      <Form.Control.Feedback type="invalid">{ctrl.erros.username?.map(__)}</Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">{ctrl.erros.password?.map(__)}</Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                  <Card.Link color="secondary">{__('login.action.forgotpass')}</Card.Link>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col sm={4}>
                      <Button variant="ligth" onClick={ctrl.handleRegister}>
                        {__('login.action.register')}
                      </Button>
                    </Col>
                    <Col></Col>
                    <Col sm={4}>
                      <Button variant="primary" onClick={ctrl.handleLogin}>
                        <FontAwesomeIcon icon={IconsDef.login} /> {__('login.action.login')}
                      </Button>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Col>
        </Row>
        <Footer center />
      </div>
    </div>
  );
});

const OldLoginComp: React.FC = observer(() => {
  const ctrl = useLoginStore();

  return (
    <>
      {ctrl.oldLogin && (
        <div className="d-grid">
          <Button onClick={ctrl.handleOldLogin}>Continuar com SSO</Button>
          <br />
        </div>
      )}
    </>
  );
});

export default LoginPage;
