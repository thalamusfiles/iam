import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';

describe('MeController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const userUrl = '/iam/me';

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
  it(`${userUrl}/ (Get) Consulta informações do usuário`, async () => {
    const result = await await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(userUrl)).expect(200);

    expect(result.body).toBeDefined();

    expect(result.body).toMatchObject(
      expect.objectContaining({
        name: expect.any(String),
        logins: expect.arrayContaining([
          expect.objectContaining({
            type: expect.any(String),
            username: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
