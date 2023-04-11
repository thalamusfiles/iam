import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Permission } from '../../../../src/model/Permission';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader, addAppRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('PermissionController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const permissionUrl = '/mgt/permission';
  const applicationUrl = '/mgt/application';

  // Cadastros de testes
  let uuidPermissionSaved = null;
  const onCheck = 'On Tst' + faker.name.jobTitle();
  const actionCheck = 'Act Tst' + faker.name.jobArea();
  const initialsPermissionCheck = `${onCheck}_${actionCheck}`.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const permissionToCreate: EntityProps<Permission> = {
    entity: {
      on: onCheck,
      action: actionCheck,
      description: 'Permission de role com único servidor',
    },
  };
  const on02Check = 'On Tst' + faker.name.jobTitle();
  const action02Check = 'Act Tst' + faker.name.jobArea();
  const initialsPermission02Check = `${on02Check}_${action02Check}`.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const permissionUpdateData: Partial<Permission> = {
    on: on02Check,
    action: action02Check,
    description: 'Permission de role com único servidor',
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
  it(`${permissionUrl}/ (Post) Cria nova permission`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(permissionUrl)).send(permissionToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    // Verifica se initials foi registrada com o nome em minusculo
    expect(result.body.entity.initials).toEqual(initialsPermissionCheck);

    uuidPermissionSaved = result.body.entity.uuid;
  });

  it(`${permissionUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${permissionUrl}/${uuidPermissionSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidPermissionSaved);
    expect(result.body.initials).toEqual(initialsPermissionCheck);
  });

  it(`${permissionUrl}/ (Post) Tenta criar o mesmo registro (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(permissionUrl).send(permissionToCreate)).expect(500);
  });

  it(`${permissionUrl}/ (Put) Atualiza a "description" do registro`, async () => {
    const updateUrl = `${permissionUrl}/${uuidPermissionSaved}`;
    const permissionUpdate = {
      ...permissionToCreate,
      entity: {
        ...permissionToCreate.entity,
        initials: undefined,
        on: undefined,
        action: undefined,
        description: permissionUpdateData.description,
        uuid: uuidPermissionSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(permissionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidPermissionSaved);
    expect(result.body.entity.on).toBeTruthy();
    expect(result.body.entity.action).toBeTruthy();
    expect(result.body.entity.initials).toEqual(initialsPermissionCheck);
    expect(result.body.entity.description).toEqual(permissionUpdateData.description);
  });

  it(`${permissionUrl}/ (Put) Atualiza o "initials" da registro`, async () => {
    const updateUrl = `${permissionUrl}/${uuidPermissionSaved}`;
    const permissionUpdate = {
      ...permissionToCreate,
      entity: {
        ...permissionToCreate.entity,
        on: permissionUpdateData.on,
        action: permissionUpdateData.action,
        description: undefined,
        uuid: uuidPermissionSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(permissionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidPermissionSaved);
    expect(result.body.entity.on).toBeTruthy();
    expect(result.body.entity.action).toBeTruthy();
    expect(result.body.entity.initials).toEqual(initialsPermission02Check);
    expect(result.body.entity.description).toBeTruthy();
  });

  it(`${permissionUrl}/ (Put) Tenta atualiza a aplicação do registro modificando header (não pode)`, async () => {
    const updateUrl = `${permissionUrl}/${uuidPermissionSaved}`;
    const findByUrl = `${permissionUrl}/${uuidPermissionSaved}`;
    const permissionUpdate = {
      ...permissionToCreate,
      entity: {
        uuid: uuidPermissionSaved,
      },
    };
    // Informa o Header de outra aplicação
    await addAppRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(permissionUpdate).expect(200);

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);
    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidPermissionSaved);
    expect(result.body.application).toBeTruthy();

    const permissionAppUuid = result.body.application;

    const appResult = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl))
      .query({ where: { initials: iamConfig.MAIN_APP_IAM_MGT } })
      .expect(200);
    expect(appResult.body).toBeTruthy();
    expect(appResult.body.length).toEqual(1);
    expect(appResult.body[0].uuid).toBeTruthy();

    const appUuid = appResult.body[0].uuid;

    expect(permissionAppUuid).toEqual(appUuid);
  });

  it(`${permissionUrl}/ (Get) Busca as registros`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(permissionUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${permissionUrl}/ (Get) Busca as registros pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(permissionUrl)))
      .query({ where: { uuid: uuidPermissionSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidPermissionSaved);
  });

  it(`${permissionUrl}/ (Get) Busca as registros pelo initials`, async () => {
    const initials = initialsPermission02Check;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(permissionUrl))
      .query({ where: { initials: initials } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
  });

  it(`${permissionUrl}/ (Delete) Remover registro`, async () => {
    const deleteUrl = `${permissionUrl}/${uuidPermissionSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });
});
