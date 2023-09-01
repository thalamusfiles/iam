import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { User } from '../../../../src/model/User';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const userUrl = '/mgt/user';

  // Cadastros de testes
  const uuidUserSaved = 'b688ddb8-19a2-4d5e-8452-b10518800ceb';
  const userNameCheck = iamConfig.FIRST_USER_NAME;
  const userToCreate: EntityProps<User> = {
    entity: {
      name: userNameCheck,
    },
  };
  const userUpdateData2: Partial<User> = {
    name: 'User 02',
  };

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
  it(`${userUrl}/ (Post) Cria novo usuário`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(userUrl)).send(userToCreate).expect(503);
    /*const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(userUrl)).send(userToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();

    uuidUserSaved = result.body.entity.uuid;*/
  });

  it(`${userUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${userUrl}/${uuidUserSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidUserSaved);
    expect(result.body.name).toEqual(userNameCheck);
  });

  it(`${userUrl}/ (Put) Atualiza o "name" do usuário`, async () => {
    const updateUrl = `${userUrl}/${uuidUserSaved}`;
    const userUpdate = {
      ...userToCreate,
      entity: {
        ...userToCreate.entity,
        name: userUpdateData2.name,
        uuid: uuidUserSaved,
      },
    };
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(userUpdate).expect(503);
    /*const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(userUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidUserSaved);
    expect(result.body.entity.name).toEqual(userUpdateData2.name);*/
  });

  it(`${userUrl}/ (Get) Busca os usuários`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(userUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${userUrl}/ (Get) Busca os usuários pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(userUrl)))
      .query({ where: { uuid: uuidUserSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidUserSaved);
  });

  it(`${userUrl}/ (Get) Busca os usuários pelo nome`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(userUrl))
      .query({ where: { name: userNameCheck } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].name).toEqual(userNameCheck);
  });

  it(`${userUrl}/ (Delete) Remover registro`, async () => {
    const deleteUrl = `${userUrl}/${uuidUserSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(503);
    //await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });

  it(`${userUrl}/ (Get) Busca usuário (principal) com "roles" e "roles.users" (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(userUrl))
      .query({
        populate: ['roles', 'roles.users'],
      })
      .expect(400);
  });
});
