import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { addBearerAuthorization, addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import { AuthRegisterDto } from '../../../../src/app/auth/controller/dto/auth.dto';
import { faker } from '@faker-js/faker';
import iamConfig from '../../../../src/config/iam.config';
import cookieConfig from '../../../../src/config/cookie.config';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const authUrl = '/auth';

  // Cadastros de testes
  const password = faker.internet.password(16);
  const oauth = {
    cliente_id: iamConfig.MAIN_APP_IAM_ID,
    response_type: 'cookie',
    redirect_uri: 'https://localhost:8080/',
    scope: 'all',
  };
  const registerDto01: AuthRegisterDto = {
    ...oauth,
    name: faker.name.fullName(),
    username: 'u_' + faker.internet.userName(),
    password: password,
    password_confirmed: password,
  };
  let coockies;
  let accessToken;
  let userInfo;

  // Executa antes de cada teste
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Inicio dos testes
  it(`${authUrl}/register (Post) Registra um novo usuário no sistema`, async () => {
    const registerUrl = `${authUrl}/register`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(201);

    expect(result.headers['set-cookie']).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('access_token');
    expect(result.body).toHaveProperty('info');
    expect(result.body).toMatchObject(
      expect.objectContaining({
        token_type: expect.any(String),
        access_token: expect.any(String),
        scope: expect.any(String),
        expires_in: expect.any(Number),
        info: {
          iat: expect.any(Number),
          uuid: expect.any(String),
          name: expect.any(String),
          applicationLogged: expect.any(String),
        },
      }),
    );
    expect(result.body.info.applicationLogged).toEqual(registerDto01.cliente_id);

    coockies = result.headers['set-cookie'];
    accessToken = result.body.access_token;
    userInfo = result.body.info;
  });

  it(`${authUrl}/ (Post) Tentar registrar o mesmo usuário (não pode)`, async () => {
    const registerUrl = `${authUrl}/register`;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(400);
  });

  it(`${authUrl}/ (Post) Realiza o login`, async () => {
    const registerUrl = `${authUrl}/login`;
    const loginDto = {
      ...oauth,
      //
      username: registerDto01.username,
      password: registerDto01.password,
    };

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);

    expect(result.headers['set-cookie']).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('access_token');
    expect(result.body).toHaveProperty('info');
    expect(result.body).toMatchObject(
      expect.objectContaining({
        token_type: expect.any(String),
        access_token: expect.any(String),
        scope: expect.any(String),
        expires_in: expect.any(Number),
        info: {
          iat: expect.any(Number),
          uuid: expect.any(String),
          name: expect.any(String),
          applicationLogged: expect.any(String),
        },
      }),
    );
    expect(result.body.info.applicationLogged).toEqual(registerDto01.cliente_id);
  });

  it(`${authUrl}/ (Get) Refresca o token/sessão de acesso`, async () => {
    const registerUrl = `${authUrl}/refresh`;

    const getRequest = request(app.getHttpServer()).get(registerUrl);
    const getRequestWithAuth = addBearerAuthorization(getRequest, accessToken);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequestWithAuth);

    const result = await getRequestWithApp.expect(200);

    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('access_token');
    expect(result.body).toHaveProperty('info');
    expect(result.body.access_token).not.toEqual(accessToken);
    expect(result.body.info.uuid).toEqual(userInfo.uuid);
    expect(result.body.info.applicationLogged).toEqual(userInfo.applicationLogged);
  });

  it(`${authUrl}/ (Get) Tenta utilizar um token inválido`, async () => {
    const registerUrl = `${authUrl}/refresh`;

    const [header, payload, verify] = accessToken.split('.');

    // Modifica conteudo do JTW
    const payloadData = JSON.parse(Buffer.from(payload, 'base64').toString());
    payloadData.regionLogged = 'xxxx';
    payloadData.applicationLogged = 'xxxx';

    // Gera novo conteúdo (Payload)
    const newPayload = Buffer.from(JSON.stringify(payloadData)).toString('base64');

    // Gera token corrompido
    const corruptedAccessToken = `${header}${newPayload}.${verify}`;

    const getRequest = request(app.getHttpServer()).get(registerUrl);
    const getRequestWithAuth = addBearerAuthorization(getRequest, corruptedAccessToken);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequestWithAuth);

    await getRequestWithApp.expect(401);
  });

  it(`${authUrl}/ (Post) Testa limite de registros por ip por minuto`, async () => {
    const registerUrl = `${authUrl}/register`;

    for (let j = 0; j < iamConfig.REGISTER_RATE_LIMITE - 2; j++) {
      const registerDto02: AuthRegisterDto = {
        ...oauth,
        name: faker.name.fullName(),
        username: 'u_' + faker.internet.userName(),
        password: password,
        password_confirmed: password,
      };

      await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto02).expect(201);
    }

    const registerDto02: AuthRegisterDto = {
      ...oauth,
      name: faker.name.fullName(),
      username: 'u_' + faker.internet.userName(),
      password: password,
      password_confirmed: password,
    };
    // Verifica se a trava de limite de tentativas de registros funciona
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto02).expect(429);
  });

  it(`${authUrl}/ (Post) Testa limite de logins por ip por minuto`, async () => {
    const registerUrl = `${authUrl}/login`;
    const loginDto = {
      ...oauth,
      username: registerDto01.username,
      password: registerDto01.password,
    };

    for (let j = 0; j < iamConfig.REGISTER_RATE_LIMITE - 1; j++) {
      await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);
    }

    // Verifica se a trava de limite de tentativas de logins funciona
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(429);
  });
});
