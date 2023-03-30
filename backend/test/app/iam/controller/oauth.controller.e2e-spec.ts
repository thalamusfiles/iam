import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';
import { NotFoundExceptionFilter } from '../../../../src/commons/catch.exception';

describe('OauthController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const authUrl = '/auth';

  // Cadastros de testes
  const oauth = {
    cliente_id: iamConfig.MAIN_APP_IAM_ID,
    response_type: 'cookie',
    redirect_uri: 'https://localhost:8080/',
    scope: 'all',
  };
  let coockies;

  // Executa antes de cada teste
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalFilters(new NotFoundExceptionFilter());
    await app.init();
  });

  // Inicio dos testes
  it(`${authUrl}/application/info (Get) Coleta informações da aplicação`, async () => {
    const registerUrl = `${authUrl}/application/info`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(registerUrl))
      .query({
        uuid: iamConfig.MAIN_APP_IAM_ID,
      })
      .expect(200);

    expect(result.body).toBeDefined();
    expect(result.body).toMatchObject(
      expect.objectContaining({
        uuid: expect.any(String),
        name: expect.any(String),
      }),
    );
  });

  it(`${authUrl}/application/info (Get) Coleta informações de uma aplicação inválida`, async () => {
    const registerUrl = `${authUrl}/application/info`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(registerUrl))
      .query({
        uuid: iamConfig.MAIN_APP_IAM_ID.replace('11111111-', '12345678-'),
      })
      .expect(404);
  });

  it(`${authUrl}/scope/info (Get) Coleta informações sobre o(s) scopo(s) informados`, async () => {
    const registerUrl = `${authUrl}/scope/info`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(registerUrl))
      .query({
        scope: iamConfig.MAIN_SCOPE_IAM,
      })
      .expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.length).toEqual(4);
    expect(result.body[0]).toMatchObject(
      expect.objectContaining({
        scope: expect.any(String),
        app: {
          name: expect.any(String),
          description: expect.any(String),
        },
      }),
    );
  });

  it(`${authUrl}/login (Post) Realiza o login`, async () => {
    const registerUrl = `${authUrl}/login`;
    const loginDto = {
      ...oauth,
      //
      username: iamConfig.FIRST_USER_EMAIL,
      password: iamConfig.FIRST_USER_EMAIL,
    };

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);

    expect(result.headers['set-cookie']).toBeDefined();
    coockies = result.headers['set-cookie'];
  });

  it(`${authUrl}/oauth2/authorize (GET) Tenta realizar login oauth sem cookie. Redireciona para o login`, async () => {
    const oauthUrl = `${authUrl}/oauth2/authorize`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(oauthUrl)).send(oauth).expect(302);
    expect(result.headers.location).toEqual('/login');
  });

  it(`${authUrl}/oauth2/authorize (GET) Tenta realizar login oauth com cookie. Redireciona para url informada.`, async () => {
    const oauthUrl = `${authUrl}/oauth2/authorize`;

    const getRequest = request(app.getHttpServer()).get(oauthUrl);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequest);

    const result = await getRequestWithApp.set('Cookie', coockies.join(' ')).send(oauth).expect(302);
    expect(result.headers.location).toEqual(oauth.redirect_uri);
  });

  it(`${authUrl}/oauth2/authorize (GET) Tenta realizar login oauth con cookien inválido (não pode)`, async () => {
    const oauthUrl = `${authUrl}/oauth2/authorize`;

    const getRequest = request(app.getHttpServer()).get(oauthUrl);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequest);

    const result = await getRequestWithApp.set('Cookie', 'cookie teste').send(oauth).expect(302);

    expect(result.headers.location).toEqual('/login');
  });

  it(`${authUrl}/oauth2/authorize (GET) Tenta realizar login oauth não informando nada (não pode)`, async () => {
    const oauthUrl = `${authUrl}/oauth2/authorize`;

    const getRequest = request(app.getHttpServer()).get(oauthUrl);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequest);

    await getRequestWithApp.set('Cookie', 'cookie teste').expect(400);
  });
});
