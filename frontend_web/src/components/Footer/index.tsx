import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { author, version } from '../../../package.json';

const Footer: React.FC = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col md={{ span: 4, offset: 8 }}>
          <strong>IAM {version}</strong> © 2020 desenvolvido por{' '}
          <a href="http://thalamus.digital/" target="_blank" rel="noopener noreferrer">
            {author}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
