import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import * as json from '../../../package.json';
import { IconsDef } from '../../commons/consts';
import { useI18N, useLanguage } from '../../commons/i18';
import UserCtxInstance from '../../store/userContext';

const { author, since, url, version } = json as any;

const Footer: React.FC = () => {
  const language = useLanguage();
  const __ = useI18N();
  return (
    <Container className="footer text-center">
      <Row>
        <Col md={{ span: 2, offset: 6 }}>
          <NavDropdown
            title={
              <>
                <FontAwesomeIcon icon={IconsDef.language} /> {__(`languages.${language}`)}{' '}
              </>
            }
            bsPrefix="dropdown-item"
            id="i18n-dd"
          >
            <NavDropdown.Item disabled>{__('menu.language')}</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => UserCtxInstance.changeLanguage(__('en-US'))}>{__('menu.english')}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => UserCtxInstance.changeLanguage(__('pt-BR'))}>{__('menu.portuguese')}</NavDropdown.Item>
          </NavDropdown>
        </Col>
        <Col md={{ span: 2 }}>
          <strong>IAM {version}</strong>
        </Col>
        <Col md={{ span: 2 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-body" style={{ textDecoration: 'decoration' }}>
            © {author} {since}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
