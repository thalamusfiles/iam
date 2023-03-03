import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Role } from '../../../../src/model/Role';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { JWTGuard } from '../../../../src/app/auth/jwt/jwt.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('RoleController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const roleUrl = '/mgt/role';

  // Cadastros de testes
  let uuidRoleSaved = null;
  const roleNameCheck = 'Reg Tst' + faker.internet.userName();
  const initialsRoleCheck = roleNameCheck.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const roleToCreate: EntityProps<Role> = {
    entity: {
      initials: roleNameCheck.toLocaleUpperCase(),
      name: roleNameCheck,
      description: 'Perfil de aplicações com único servidor',
    },
  };
  const roleUpdateData2: Partial<Role> = {
    initials: 'Perfil_02',
    name: 'Perfil 02',
  };
  const roleUpdateData3: Partial<Role> = {
    initials: 'Perfil_03',
    name: 'Perfil 03',
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
  it(`${roleUrl}/ (Post) Cria nova região`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(roleUrl)).send(roleToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    // Verifica se initials foi registrada com o nome em minusculo
    expect(result.body.entity.initials).toEqual(initialsRoleCheck);

    uuidRoleSaved = result.body.entity.uuid;
  });

  /*it(`${roleUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${roleUrl}/${uuidRoleSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidRoleSaved);
    expect(result.body.initials).toEqual(initialsRoleCheck);
  });

  it(`${roleUrl}/ (Post) Tenta criar a mesma região (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(roleUrl).send(roleToCreate)).expect(500);
  });

  it(`${roleUrl}/ (Put) Atualiza o "name" da região`, async () => {
    const updateUrl = `${roleUrl}/${uuidRoleSaved}`;
    const roleUpdate = {
      ...roleToCreate,
      entity: {
        ...roleToCreate.entity,
        initials: undefined,
        name: roleUpdateData2.name,
        uuid: uuidRoleSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(roleUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRoleSaved);
    expect(result.body.entity.initials).not.toBeTruthy();
    expect(result.body.entity.name).toEqual(roleUpdateData2.name);
  });

  it(`${roleUrl}/ (Put) Atualiza a "initials" da região (ignora novo valor)`, async () => {
    const updateUrl = `${roleUrl}/${uuidRoleSaved}`;
    const findByUrl = `${roleUrl}/${uuidRoleSaved}`;

    const roleUpdate = {
      ...roleToCreate,
      entity: {
        ...roleToCreate.entity,
        initials: roleUpdateData3.initials,
        name: roleUpdateData3.name,
        uuid: uuidRoleSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(roleUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRoleSaved);
    expect(result.body.entity.name).toEqual(roleUpdateData3.name);

    const result2 = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);
    expect(result2.body).toBeDefined();
    expect(result2.body.uuid).toEqual(uuidRoleSaved);
    expect(result2.body.name).toEqual(roleUpdateData3.name);
    // Valores que não podem ser alterados
    expect(result2.body.initials).toEqual(initialsRoleCheck);
  });

  it(`${roleUrl}/ (Get) Busca as regiões`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${roleUrl}/ (Get) Busca as regiões pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl)))
      .query({ where: { uuid: uuidRoleSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidRoleSaved);
  });

  it(`${roleUrl}/ (Get) Busca as regiões pelo initials`, async () => {
    const initials = initialsRoleCheck;
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

  it(`${roleUrl}/ (Get) Busca região (principal) com "applications"`, async () => {
    const initials = iamConfig.MAIN_REGION;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl))
      .query({
        where: { initials: initials },
        populate: ['permissions', 'createdBy', 'updatedBy'],
      })
      .expect(200);

    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
    expect(result.body[0].permissions.length).toBeGreaterThanOrEqual(2);
    expect(result.body[0].permissions).toContainEqual(expect.objectContaining({ initials: iamConfig.MAIN_APP_IAM }));
    expect(result.body[0].permissions).toContainEqual(expect.objectContaining({ initials: iamConfig.MAIN_APP_IAM_MGT }));
    expect(result.body[0].createdBy).toBeTruthy();
    expect(result.body[0].updatedBy).toBeTruthy();
  });

  it(`${roleUrl}/ (Get) Busca região (principal) com "permissions" e "permissions.roles" (não pode)`, async () => {
    const initials = iamConfig.MAIN_REGION;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(roleUrl))
      .query({
        where: { initials: initials },
        populate: ['permissions', 'permissions.roles'],
      })
      .expect(400);
  });*/
});
