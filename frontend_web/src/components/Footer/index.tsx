import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import * as json from '../../../package.json';
import { IconsDef } from '../../commons/consts';
import { useI18N, useLanguage } from '../../commons/i18';
import UserCtxInstance from '../../store/userContext';

const { author, since, url, version } = json as any;

const Footer: React.FC<{ center?: boolean }> = ({ center }) => {
  const language = useLanguage();
  const __ = useI18N();
  return (
    <Container className="footer text-center">
      <Row>
        <Col md={{ span: 2, offset: center ? 3 : 6 }}>
          <DropdownButton
            title={
              <>
                <FontAwesomeIcon icon={IconsDef.language} /> {__(`languages.${language}`)}{' '}
              </>
            }
            bsPrefix="dropdown-item"
            id="i18n-dd"
          >
            <Dropdown.Item disabled>{__('menu.language')}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => UserCtxInstance.changeLanguage(__('en-US'))}>{__('menu.english')}</Dropdown.Item>
            <Dropdown.Item onClick={() => UserCtxInstance.changeLanguage(__('pt-BR'))}>{__('menu.portuguese')}</Dropdown.Item>
          </DropdownButton>
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
