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
import PermissionInfoModal from '../login/permissions.modal';
import { RegisterCtrl, RegisterProvider, useRegisterStore } from './ctrl';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

const RegisterPage: React.FC = () => {
  const ctrl = new RegisterCtrl();

  const { app } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    ctrl.setParams(
      //
      app as string,
      searchParams.get('redirectTo'),
      searchParams.get('scope'),
    );
  });

  return (
    <RegisterProvider value={ctrl}>
      <RegisterPageProvided />
    </RegisterProvider>
  );
};

const RegisterPageProvided: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = useRegisterStore();

  return (
    <div style={{ backgroundImage: `url(${bgImg})` }} className="bgImageCover">
      <div style={{ backgroundColor: 'rgba(90,90,90,.8)', width: '100%', padding: 20 }} className="bgImageCover">
      <PermissionInfoModal ctrl={ctrl} />

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

                  <Form>
                    {!!ctrl.erroMessages?.length && <Alert variant="danger">{ctrl.erroMessages.map(__)}</Alert>}

                    <Form.Group controlId="login.application">
                      <Form.Label>{__('login.application')}</Form.Label>
                      <Form.Control type="text" defaultValue={ctrl.appInfo?.name} disabled />
                      <Form.Text className="text-muted">{__('login.application-info')}</Form.Text>
                    </Form.Group>

                    <p onClick={() => ctrl.showPermissionModal()}>
                      <br />
                      <strong>{__('login.permissions-info')}</strong>
                    </p>

                    <Form.Group controlId="register.name">
                      <Form.Label>{__('register.name')}</Form.Label>
                      <Form.Control
                        placeholder={__('register.typename')}
                        type="name"
                        onKeyPress={ctrl.onKeyUpFilter}
                        onChange={ctrl.handleName}
                        isInvalid={!!ctrl.erros.name}
                      />
                      <Form.Control.Feedback type="invalid">{ctrl.erros.name?.map(__)}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="register.username">
                      <Form.Label>{__('register.username')}</Form.Label>
                      <Form.Control
                        placeholder={__('register.typeusername')}
                        type="username"
                        onKeyPress={ctrl.onKeyUpFilter}
                        onChange={ctrl.handleUsername}
                        isInvalid={!!ctrl.erros.username}
                      />
                      <Form.Control.Feedback type="invalid">{ctrl.erros.username?.map(__)}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>{__('register.password')}</Form.Label>
                          <Form.Control
                            placeholder={__('register.password') as string}
                            type="password"
                            autoComplete="off"
                            onKeyPress={ctrl.onKeyUpFilter}
                            onChange={ctrl.handlePassword}
                            isInvalid={!!ctrl.erros.password}
                          />
                          <Form.Control.Feedback type="invalid">{ctrl.erros.password?.map(__)}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>{__('register.passwordcheck')}</Form.Label>
                          <Form.Control
                            placeholder={__('register.passwordcheck') as string}
                            type="password"
                            autoComplete="off"
                            onKeyPress={ctrl.onKeyUpFilter}
                            onChange={ctrl.handlePasswordConfirmed}
                            isInvalid={!!ctrl.erros.password_confirmed}
                          />
                          <Form.Control.Feedback type="invalid">{ctrl.erros.password_confirmed?.map(__)}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col sm={6}>
                      <Button size="sm" variant="ligth" onClick={ctrl.toLogin}>
                        {__('register.action.tologin')}
                      </Button>
                    </Col>
                    <Col></Col>
                    <Col sm={5}>
                      <Button variant="primary" onClick={ctrl.toRegister}>
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
});

export default RegisterPage;
