import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../../commons/consts';
import { useI18N } from '../../../../commons/i18';
import { observer } from 'mobx-react-lite';
import SideBarHome from '../../home/sidebarhome';
import { Button } from 'react-bootstrap';
import TCard from '../../../../components/Card/card';
import { Route, Routes } from 'react-router-dom';
import TokensNewModalPage from '../new';
import { historyPush } from '../../../../commons/route';
import { TokensCtx, TokensProvider, useTokensStore } from './ctrl';
import { useEffect } from 'react';

const TokensPage: React.FC = () => {
  const ctrl = new TokensCtx();

  useEffect(() => {
    ctrl.init();
  });

  return (
    <>
      <Routes>
        <Route path={'/modal/new'} element={<TokensNewModalPage />} />
      </Routes>
      <TokensProvider value={ctrl}>
        <TokensPageProvided />
      </TokensProvider>
    </>
  );
};

const TokensPageProvided: React.FC = () => {
  const __ = useI18N();

  return (
    <Container>
      <Row>
        <Col md={3}>
          <SideBarHome />
        </Col>
        <Col md={9}>
          <h2 id="token_about">
            <FontAwesomeIcon icon={IconsDef.tokens} /> {__('account.tokens.title')}
          </h2>
          <Row>
            <Col md={9}>
              <p>{__('account.tokens.description')}</p>
            </Col>
            <Col md={3}>
              <Button className="float-end" onClick={() => historyPush('/new', { inModal: true })}>
                {__('actions.new')}
              </Button>
            </Col>
          </Row>

          <br />
          <TokensList />
        </Col>
      </Row>
    </Container>
  );
};

const TokensList: React.FC = observer(() => {
  const ctrl = useTokensStore();
  return (
    <>
      {ctrl.tokens.map((token, idx) => (
        <div key={idx}>
          <TCard faicon={IconsDef.remove} title={token.name} subtitle={token.scope} full onIconClick={() => ctrl.removeToken(token)} />
          <br />
        </div>
      ))}
    </>
  );
});

export default TokensPage;
