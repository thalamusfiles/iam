import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('MeController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const tokenUrl = '/iam/token';

  // Executa antes de cada teste
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AccessGuard)
      .useClass(JTWGuardMockAdmin)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Inicio dos testes
  it(`/auth/login (Post) Realiza o login`, async () => {
    const loginUrl = `/auth/login`;
    const oauth = {
      cliente_id: iamConfig.MAIN_APP_IAM_ID,
      response_type: 'cookie',
      redirect_uri: 'https://localhost:8080/',
      scope: 'all',
    };

    const loginDto = {
      ...oauth,
      //
      username: iamConfig.FIRST_USER_EMAIL,
      password: iamConfig.FIRST_USER_EMAIL,
    };

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(loginUrl)).send(loginDto).expect(201);
  });

  it(`${tokenUrl}/active (Get) Coleta todos os tokens ativos`, async () => {
    const activeTokenUrl = `${tokenUrl}/active`;
    const result = await await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(activeTokenUrl)).expect(200);

    console.log(result.body.length);

    expect(result.body).toBeDefined();
    expect(result.body.length).toBeGreaterThanOrEqual(1);
    expect(result.body[0]).toMatchObject(
      expect.objectContaining({
        uuid: expect.any(String),
        scope: expect.any(String),
        userAgent: expect.any(String),
        createdAt: expect.any(String),
        expiresIn: expect.any(String),
      }),
    );
  });

  it(`${tokenUrl}/all (Get) Coleta todos os logins realizados`, async () => {
    const activeTokenUrl = `${tokenUrl}/all`;
    const result = await await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(activeTokenUrl)).expect(200);

    console.log(result.body.length);

    expect(result.body).toBeDefined();
    expect(result.body.length).toBeGreaterThanOrEqual(1);
    expect(result.body[0]).toMatchObject(
      expect.objectContaining({
        scope: expect.any(String),
        userAgent: expect.any(String),
        createdAt: expect.any(String),
        expiresIn: expect.any(String),
      }),
    );
  });
});
