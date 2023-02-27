import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { JWTGuard } from '../../../../src/app/auth/jwt/jwt.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import { AuthRegisterDto } from '../../../../src/app/auth/controller/dto/auth.dto';
import { faker } from '@faker-js/faker';
import iamConfig from '../../../../src/config/iam.config';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const authUrl = '/auth';

  // Cadastros de testes
  const password = faker.internet.password(16);
  const registerDto01: AuthRegisterDto = {
    name: faker.name.fullName(),
    username: 'u_' + faker.internet.userName(),
    password: password,
    password_confirmed: password,
  };

  // Executa antes de cada teste
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JWTGuard)
      .useClass(JTWGuardMockAdmin)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Inicio dos testes
  it(`${authUrl}/ (Post) Registra um novo usuário no sistema`, async () => {
    const registerUrl = `${authUrl}/local/register`;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(201);

    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('accessToken');
    expect(result.body).toHaveProperty('userInfo');
    expect(result.body).toMatchObject(
      expect.objectContaining({
        accessToken: expect.any(String),
        userInfo: {
          uuid: expect.any(String),
          name: expect.any(String),
          regionLogged: expect.any(String),
          applicationLogged: expect.any(String),
        },
      }),
    );
    expect(result.body.userInfo.regionLogged.length).toBeGreaterThan(3);
    expect(result.body.userInfo.applicationLogged.length).toBeGreaterThan(3);
  });

  it(`${authUrl}/ (Post) Tentar registrar o mesmo usuário (não pode)`, async () => {
    const registerUrl = `${authUrl}/local/register`;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(500);
  });

  it(`${authUrl}/ (Post) Tenta realizar o login`, async () => {
    const registerUrl = `${authUrl}/local/login`;
    const loginDto = {
      username: registerDto01.username,
      password: registerDto01.password,
    };

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(loginDto).expect(201);

    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('accessToken');
    expect(result.body).toHaveProperty('userInfo');
    expect(result.body).toMatchObject(
      expect.objectContaining({
        accessToken: expect.any(String),
        userInfo: {
          uuid: expect.any(String),
          name: expect.any(String),
          regionLogged: expect.any(String),
          applicationLogged: expect.any(String),
        },
      }),
    );
    expect(result.body.userInfo.regionLogged.length).toBeGreaterThan(3);
    expect(result.body.userInfo.applicationLogged.length).toBeGreaterThan(3);
  });

  // Inicio dos testes
  it(`${authUrl}/ (Post) Testa limite de registros por ip por minuto`, async () => {
    const registerUrl = `${authUrl}/local/register`;

    for (let j = 0; j < iamConfig.REGISTER_RATE_LIMITE - 2; j++) {
      const registerDto02: AuthRegisterDto = {
        name: faker.name.fullName(),
        username: 'u_' + faker.internet.userName(),
        password: password,
        password_confirmed: password,
      };

      await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto02).expect(201);
    }

    const registerDto02: AuthRegisterDto = {
      name: faker.name.fullName(),
      username: 'u_' + faker.internet.userName(),
      password: password,
      password_confirmed: password,
    };
    // Verifica se a trava de limite de tentativas de registros funciona
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto02).expect(429);
  });

  it(`${authUrl}/ (Post) Testa limite de logins por ip por minuto`, async () => {
    const registerUrl = `${authUrl}/local/login`;
    const loginDto = {
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
