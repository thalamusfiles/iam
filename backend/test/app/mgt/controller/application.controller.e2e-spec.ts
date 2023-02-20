import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Application } from '../../../../src/model/System/Application';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { JWTGuard } from '../../../../src/app/auth/jwt/jwt.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';
import { Region } from '../../../../src/model/System/Region';

describe('ApplicationController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const regionUrl = '/mgt/region';
  const applicationUrl = '/mgt/application';

  // Cadastros de testes
  // Região
  let uuidRegionSaved = null;
  const regionName = 'Reg Tst' + faker.address.country();
  const regionToCreate: EntityProps<Region> = {
    entity: {
      initials: regionName.toLocaleUpperCase(),
      name: regionName,
      description: 'Região de aplicações com único servidor',
    },
  };

  // Aplicação
  let uuidApplicationSaved = null;
  const applicationNameCheck = 'App Tst' + faker.address.country();
  const initialsApplicationCheck = applicationNameCheck.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const applicationToCreate: EntityProps<Application> = {
    entity: {
      initials: applicationNameCheck.toLocaleUpperCase(),
      name: applicationNameCheck,
      description: 'Aplicações cadastrada como teste',
      privateSSO: true,
      oneRoleRequired: false,
    },
  };
  const applicationUpdateData2: Partial<Application> = {
    initials: 'App_02',
    name: 'Global 02',
  };
  const applicationUpdateData3: Partial<Application> = {
    initials: 'App_03',
    name: 'App 03',
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
  it(`${regionUrl}/ (Post) Cria a região utilizada nos testes de aplicação`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(regionUrl)).send(regionToCreate).expect(201);

    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();

    uuidRegionSaved = result.body.entity.uuid;
  });

  // Inicio dos testes
  it(`${applicationUrl}/ (Post) Cria nova aplicação`, async () => {
    //applicationToCreate.entity.regions = uuidRegionSaved as any;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(applicationUrl)).send(applicationToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    // Verifica se initials foi registrada com o nome em minusculo
    expect(result.body.entity.initials).toEqual(initialsApplicationCheck);

    uuidApplicationSaved = result.body.entity.uuid;
  });

  it(`${applicationUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${applicationUrl}/${uuidApplicationSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidApplicationSaved);
    expect(result.body.initials).toEqual(initialsApplicationCheck);
  });

  it(`${applicationUrl}/ (Post) Tenta criar a mesma aplicação (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(applicationUrl).send(applicationToCreate)).expect(500);
  });

  it(`${applicationUrl}/ (Put) Atualiza apenas o "name" da aplicação`, async () => {
    const updateUrl = `${applicationUrl}/${uuidApplicationSaved}`;
    const findByUrl = `${applicationUrl}/${uuidApplicationSaved}`;

    const applicationUpdate = {
      ...applicationToCreate,
      entity: {
        ...applicationToCreate.entity,
        uuid: uuidApplicationSaved,
        name: applicationUpdateData2.name,
        initials: undefined,
      },
    };
    // Não encaminhar os registros abaixo
    delete applicationUpdate.entity.privateSSO;
    delete applicationUpdate.entity.oneRoleRequired;

    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(applicationUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidApplicationSaved);
    expect(result.body.entity.initials).not.toBeTruthy();
    expect(result.body.entity.name).toEqual(applicationUpdateData2.name);

    // Verifica os dados não informados
    const result2 = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);
    expect(result2.body).toBeDefined();
    expect(result2.body.uuid).toEqual(uuidApplicationSaved);
    // Valores que não podem ser alterados
    expect(result2.body.privateSSO).toEqual(applicationToCreate.entity.privateSSO);
    expect(result2.body.oneRoleRequired).toEqual(applicationToCreate.entity.oneRoleRequired);
  });

  it(`${applicationUrl}/ (Put) Atualiza a "initials" da aplicação (ignora novo valor)`, async () => {
    const updateUrl = `${applicationUrl}/${uuidApplicationSaved}`;
    const findByUrl = `${applicationUrl}/${uuidApplicationSaved}`;

    const applicationUpdate = {
      ...applicationToCreate,
      entity: {
        ...applicationToCreate.entity,
        initials: applicationUpdateData3.initials,
        name: applicationUpdateData3.name,
        uuid: uuidApplicationSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(applicationUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidApplicationSaved);
    expect(result.body.entity.name).toEqual(applicationUpdateData3.name);

    // Verifica registro salva
    const result2 = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);
    expect(result2.body).toBeDefined();
    expect(result2.body.uuid).toEqual(uuidApplicationSaved);
    expect(result2.body.name).toEqual(applicationUpdateData3.name);
    // Valores que não podem ser alterados
    expect(result2.body.initials).toEqual(initialsApplicationCheck);
  });

  it(`${applicationUrl}/ (Get) Busca as aplicações`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${applicationUrl}/ (Get) Busca as aplicações pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl)))
      .query({ where: { uuid: uuidApplicationSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidApplicationSaved);
  });

  it(`${applicationUrl}/ (Get) Busca as aplicações pelo initials`, async () => {
    const initials = initialsApplicationCheck;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl))
      .query({ where: { initials: initials } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
  });

  it(`${applicationUrl}/ (Delete) Remover registro`, async () => {
    const deleteUrl = `${applicationUrl}/${uuidApplicationSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });

  it(`${applicationUrl}/ (Get) Busca aplicação (principal) com "regions"`, async () => {
    const initials = iamConfig.MAIN_APP_IAM;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl))
      .query({
        where: { initials: initials },
        populate: ['regions', 'createdBy', 'updatedBy'],
      })
      .expect(200);

    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
    expect(result.body[0].regions.length).toBeGreaterThanOrEqual(1);
    expect(result.body[0].regions).toContainEqual(expect.objectContaining({ initials: iamConfig.MAIN_REGION }));
    expect(result.body[0].createdBy).toBeTruthy();
    expect(result.body[0].updatedBy).toBeTruthy();
  });

  it(`${applicationUrl}/ (Get) Busca aplicação (principal) com "regions" e "regions.applications" (não pode)`, async () => {
    const initials = iamConfig.MAIN_APP_IAM;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl))
      .query({
        where: { initials: initials },
        populate: ['regions', 'regions.applications'],
      })
      .expect(400);
  });

  it(`${regionUrl}/ (Delete) Remover registro da região utilizada nos testes`, async () => {
    const deleteUrl = `${regionUrl}/${uuidRegionSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });
});
