import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Application } from '../../../../src/model/System/Application';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { AccessGuard } from '../../../../src/app/auth/passaport/access.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('ApplicationController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const applicationUrl = '/mgt/application';

  // Aplicação
  let uuidApplicationSaved = null;
  const applicationNameCheck = 'App Tst' + faker.address.country();
  const initialsApplicationCheck = applicationNameCheck.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const applicationToCreate: EntityProps<Application> = {
    entity: {
      initials: applicationNameCheck.toLocaleUpperCase(),
      name: applicationNameCheck,
      description: 'Aplicações cadastrada como teste',
      public: false,
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
      .overrideGuard(AccessGuard)
      .useClass(JTWGuardMockAdmin)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Inicio dos testes
  it(`${applicationUrl}/ (Post) Cria nova aplicação`, async () => {
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
    delete applicationUpdate.entity.public;

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
    expect(result2.body.public).toEqual(applicationToCreate.entity.public);
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

  it(`${applicationUrl}/ (Get) Busca aplicação (principal) com "createdBy" e "updatedBy`, async () => {
    const initials = iamConfig.MAIN_APP_IAM;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(applicationUrl))
      .query({
        where: { initials: initials },
        populate: ['createdBy', 'updatedBy'],
      })
      .expect(200);

    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
    expect(result.body[0].createdBy).toBeTruthy();
    expect(result.body[0].updatedBy).toBeTruthy();
  });
});
