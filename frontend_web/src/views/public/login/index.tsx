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
import UserValue from '../../../store/userContext';

const bgImg = [bgRotate01, bgRotate02, bgRotate03, bgRotate04][Math.floor(Math.random() * 4)];

const LoginPage: React.FC<{}> = () => {
  const __ = useI18N();
  const { region, app } = useParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [erros, setErros] = useState({ username: null as string | null, password: null as string | null });
  const [redirectTo, setRedirectTo] = useState(null as string | null);
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
    UserValue.login(form.username, form.password)
      .then(() => {
        historyPush('home');
      })
      .catch((error) => {
        setErros({
          username: 'User not found',
          password: 'Invalid pass',
        });
      });
  }

  function toRegister() {
    historyPush('register', { region, app });
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

                  {!redirectTo && (
                    <Row>
                      <Col>
                        <Form.Group controlId="login.region">
                          <Form.Label>{__('login.region')}</Form.Label>
                          <Form.Control type="text" value="Global System" disabled />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="login.system">
                          <Form.Label>{__('login.system')}</Form.Label>
                          <Form.Control type="text" value="Root" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  <Form.Group controlId="login.username">
                    <Form.Label>{__('login.username')}</Form.Label>
                    <Form.Control
                      placeholder="Enter your user name, code or email"
                      type="email"
                      onKeyPress={onKeyUpFilter}
                      onChange={handleUsername}
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
                      onKeyPress={onKeyUpFilter}
                      onChange={handlePassword}
                      isInvalid={!!erros.password}
                    />
                    <Form.Control.Feedback type="invalid">{erros.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Card.Link color="secondary">{__('login.action.forgotpass')}</Card.Link>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col sm={4}>
                      <Button variant="ligth" onClick={toRegister} block>
                        {__('login.action.register')}
                      </Button>
                    </Col>
                    <Col></Col>
                    <Col sm={4}>
                      <Button variant="primary" onClick={toLogin} block>
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
};
export default LoginPage;
