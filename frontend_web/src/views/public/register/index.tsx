import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
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
import { historyPush } from '../../../commons/route';
import UserCtxInstance from '../../../store/userContext';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

const RegisterPage: React.FC = () => {
  const __ = useI18N();
  const { region, app } = useParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [erros, setErros] = useState({ username: null as string | null, password: null as string | null });
  const [, setRedirectTo] = useState(null as string | null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setRedirectTo(searchParams.get('redirectTo'));
  }, [searchParams]);

  function handleUsername(e: any) {
    setForm({ username: e.target.value, password: form.password });
  }

  function handlePassword(e: any) {
    setForm({ password: e.target.value, username: form.username });
  }

  function toLogin() {
    historyPush('login', { region, app });
  }

  function toRegister() {
    UserCtxInstance.login(form.username, form.password)
      .then(() => {
        historyPush('home_account');
      })
      .catch((error) => {
        setErros({
          username: 'User not found',
          password: 'Invalid pass',
        });
      });
  }

  function onKeyUpFilter(e: any) {
    if (e.charCode === 13) {
      toLogin();
    }
  }

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

                  <Form.Group controlId="register.username">
                    <Form.Label>{__('register.username')}</Form.Label>
                    <Form.Control
                      placeholder="Enter your user name, code or email"
                      type="username"
                      onKeyPress={onKeyUpFilter}
                      onChange={handleUsername}
                      isInvalid={!!erros.username}
                    />
                    <Form.Control.Feedback type="invalid">{erros.username}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="register.email">
                    <Form.Label>{__('register.email')}</Form.Label>
                    <Form.Control
                      placeholder="Enter your email"
                      type="email"
                      onKeyPress={onKeyUpFilter}
                      onChange={handleUsername}
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
                          onKeyPress={onKeyUpFilter}
                          onChange={handlePassword}
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
                          onKeyPress={onKeyUpFilter}
                          onChange={handlePassword}
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
                      <Button size="sm" variant="ligth" onClick={toLogin}>
                        {__('register.action.tologin')}
                      </Button>
                    </Col>
                    <Col></Col>
                    <Col sm={5}>
                      <Button variant="primary" onClick={toRegister}>
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
};

export default RegisterPage;
