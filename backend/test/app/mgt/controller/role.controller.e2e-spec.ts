import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Role } from '../../../../src/model/Role';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';

describe('RoleController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const roleUrl = '/mgt/role';

  // Cadastros de testes
  let uuidRoleSaved = null;
  const roleNameCheck = 'Reg Tst' + faker.name.jobTitle();
  const initialsRoleCheck = roleNameCheck.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const roleToCreate: EntityProps<Role> = {
    entity: {
      initials: roleNameCheck.toLocaleUpperCase(),
      name: roleNameCheck,
      description: 'Role de aplicações com único servidor',
    },
  };
  const roleName02Check = 'Reg Tst' + faker.name.jobTitle();
  const initialsRole02Check = roleName02Check.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const roleUpdateData: Partial<Role> = {
    initials: roleName02Check.toLocaleUpperCase(),
    name: roleName02Check,
    description: 'Role de aplicações com único servidor 02',
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
  it(`${roleUrl}/ (Post) Cria nova role`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(roleUrl)).send(roleToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    // Verifica se initials foi registrada com o nome em minusculo
    expect(result.body.entity.initials).toEqual(initialsRoleCheck);

    uuidRoleSaved = result.body.entity.uuid;
  });

  it(`${roleUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${roleUrl}/${uuidRoleSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidRoleSaved);
    expect(result.body.initials).toEqual(initialsRoleCheck);
  });

  it(`${roleUrl}/ (Post) Tenta criar o mesmo registro (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(roleUrl).send(roleToCreate)).expect(500);
  });

  it(`${roleUrl}/ (Put) Atualiza o "name" e "description" do registro`, async () => {
    const updateUrl = `${roleUrl}/${uuidRoleSaved}`;
    const roleUpdate = {
      ...roleToCreate,
      entity: {
        ...roleToCreate.entity,
        initials: undefined,
        name: roleUpdateData.name,
        description: roleUpdateData.description,
        uuid: uuidRoleSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(roleUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRoleSaved);
    expect(result.body.entity.initials).toEqual(initialsRoleCheck);
    expect(result.body.entity.name).toEqual(roleUpdateData.name);
    expect(result.body.entity.description).toEqual(roleUpdateData.description);
  });

  it(`${roleUrl}/ (Put) Atualiza o "initials" da registro`, async () => {
    const updateUrl = `${roleUrl}/${uuidRoleSaved}`;
    const roleUpdate = {
      ...roleToCreate,
      entity: {
        ...roleToCreate.entity,
        initials: roleUpdateData.initials,
        name: undefined,
        description: undefined,
        uuid: uuidRoleSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(roleUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRoleSaved);
    expect(result.body.entity.initials).toEqual(initialsRole02Check);
    expect(result.body.entity.name).toBeTruthy();
    expect(result.body.entity.description).toBeTruthy();
  });

  it(`${roleUrl}/ (Get) Busca as registros`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${roleUrl}/ (Get) Busca as registros pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl)))
      .query({ where: { uuid: uuidRoleSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidRoleSaved);
  });

  it(`${roleUrl}/ (Get) Busca as registros pelo initials`, async () => {
    const initials = initialsRole02Check;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl))
      .query({ where: { initials: initials } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
  });

  it(`${roleUrl}/ (Delete) Remover registro`, async () => {
    const deleteUrl = `${roleUrl}/${uuidRoleSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });
});
