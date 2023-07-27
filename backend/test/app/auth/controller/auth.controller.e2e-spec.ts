import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { addBearerAuthorization, addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import { AuthRegisterDto } from '../../../../src/app/auth/controller/dto/auth.dto';
import { faker } from '@faker-js/faker';
import iamConfig from '../../../../src/config/iam.config';
import { NotFoundExceptionFilter } from '../../../../src/commons/catch.exception';
import { OauthFieldsDto } from '../../../../src/app/auth/controller/dto/oauth.dto';
import { IdTokenInfo } from '../../../../src/app/auth/passaport/access-user-info';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const authUrl = '/auth';

  // Cadastros de testes
  const password = '1Ab' + faker.internet.password(16);
  const oauth: OauthFieldsDto = {
    client_id: iamConfig.MAIN_APP_IAM_ID,
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
  let accessToken: string;
  let userInfo: IdTokenInfo;

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

  it(`${authUrl}/register (Post) Registra um novo usuário no sistema`, async () => {
    const registerUrl = `${authUrl}/register`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(201);

    expect(result.headers['set-cookie']).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body).toMatchObject(
      expect.objectContaining({
        id_token: expect.any(String),
        access_token: expect.any(String),
        token_type: expect.any(String),
        scope: expect.any(String),
        expires_in: expect.any(Number),
      }),
    );
    expect(result.body.id_token).toBeDefined();
    expect(result.body.access_token).toBeDefined();

    const jwtPayload = JSON.parse(Buffer.from(result.body.id_token.split('.')[1], 'base64').toString('utf8'));
    expect(jwtPayload).toMatchObject(
      expect.objectContaining({
        aud: expect.any(String),
        exp: expect.any(Number),
        iat: expect.any(Number),
        iss: expect.any(String),
        name: expect.any(String),
        sub: expect.any(String),
      }),
    );

    userInfo = jwtPayload;
  });

  it(`${authUrl}/register (Post) Tentar registrar o mesmo usuário (não pode)`, async () => {
    const registerUrl = `${authUrl}/register`;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(400);
  });

  it(`${authUrl}/login (Post) Realiza o login`, async () => {
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
    expect(result.body).toMatchObject(
      expect.objectContaining({
        id_token: expect.any(String),
        access_token: expect.any(String),
        token_type: expect.any(String),
        scope: expect.any(String),
        expires_in: expect.any(Number),
      }),
    );
    expect(result.body.id_token).toBeDefined();
    expect(result.body.access_token).toBeDefined();

    const jwtPayload = JSON.parse(Buffer.from(result.body.id_token.split('.')[1], 'base64').toString('utf8'));
    expect(jwtPayload).toMatchObject(
      expect.objectContaining({
        aud: expect.any(String),
        exp: expect.any(Number),
        iat: expect.any(Number),
        iss: expect.any(String),
        name: expect.any(String),
        sub: expect.any(String),
      }),
    );

    accessToken = result.body.access_token;
  });

  it(`${authUrl}/login (Post) Realiza o login com o primeiro usuário`, async () => {
    const registerUrl = `${authUrl}/login`;
    const loginDto = {
      ...oauth,
      //
      username: iamConfig.FIRST_USER_EMAIL,
      password: iamConfig.FIRST_USER_EMAIL,
    };

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);
  });

  it(`${authUrl}/refresh (Get) Refresca o token/sessão de acesso`, async () => {
    const registerUrl = `${authUrl}/refresh`;

    const getRequest = request(app.getHttpServer()).get(registerUrl);
    const getRequestWithAuth = addBearerAuthorization(getRequest, accessToken);
    const getRequestWithApp = addGlobalIAMMgtRequestHeader(getRequestWithAuth);

    const result = await getRequestWithApp.expect(200);

    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('access_token');
    expect(result.body).toHaveProperty('id_token');
    expect(result.body.access_token).not.toEqual(accessToken);

    const jwtPayload = JSON.parse(Buffer.from(result.body.id_token.split('.')[1], 'base64').toString('utf8'));

    expect(jwtPayload.sub).toEqual(userInfo.sub);
    expect(jwtPayload.aud).toEqual(userInfo.aud);
  });

  it(`${authUrl}/refresh (Get) Tenta utilizar um token inválido`, async () => {
    const registerUrl = `${authUrl}/refresh`;

    const [header, payload, verify] = accessToken.split('.');

    // Modifica conteudo do JTW
    const payloadData = JSON.parse(Buffer.from(payload, 'base64').toString());
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

  it(`${authUrl}/register (Post) Testa limite de registros por ip por minuto`, async () => {
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

  it(`${authUrl}/login (Post) Testa limite de logins por ip por minuto`, async () => {
    const registerUrl = `${authUrl}/login`;
    const loginDto = {
      ...oauth,
      username: registerDto01.username,
      password: registerDto01.password,
    };

    for (let j = 0; j < iamConfig.REGISTER_RATE_LIMITE - 2; j++) {
      await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);
    }

    // Verifica se a trava de limite de tentativas de logins funciona
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(429);
  });
});
