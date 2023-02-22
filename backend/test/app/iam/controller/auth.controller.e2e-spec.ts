import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { JWTGuard } from '../../../../src/app/auth/jwt/jwt.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import { AuthRegisterDto } from '../../../../src/app/iam/controller/dto/auth.dto';
import { faker } from '@faker-js/faker';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const authUrl = '/iam/auth';

  // Cadastros de testes
  const password = faker.internet.password(16);
  const registerDto01: AuthRegisterDto = {
    name: faker.name.fullName(),
    username: faker.internet.userName(),
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

    console.log(registerDto01);

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(registerUrl)).send(registerDto01).expect(201);

    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty('access_token');
    expect(result.body).toHaveProperty('userInfo');
    expect(result.body.userInfo).toHaveProperty('uuid');
    expect(result.body.userInfo).toHaveProperty('name');
    expect(result.body.userInfo).toHaveProperty('regionLogged');
    expect(result.body.userInfo).toHaveProperty('applicationLogged');
  });
});
