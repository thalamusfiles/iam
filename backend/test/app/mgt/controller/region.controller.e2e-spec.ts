import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Region } from '../../../../src/model/System/Region';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { JWTGuard } from '../../../../src/app/auth/jwt/jwt.guard';
import { JTWGuardMockAdmin } from '../../../mocks/jwt.mock';
import { faker } from '@faker-js/faker';
import { addGlobalIAMMgtRequestHeader } from '../../../utils/setheader.utils';
import iamConfig from '../../../../src/config/iam.config';

describe('RegionController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const regionUrl = '/mgt/region';

  // Cadastros de testes
  let uuidRegionSaved = null;
  const regionNameCheck = 'Reg Tst' + faker.address.country();
  const initialsRegionCheck = regionNameCheck.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  const regionToCreate: EntityProps<Region> = {
    entity: {
      initials: regionNameCheck.toLocaleUpperCase(),
      name: regionNameCheck,
      description: 'Região de aplicações com único servidor',
    },
  };
  const regionUpdateData2: Partial<Region> = {
    initials: 'Global_02',
    name: 'Global 02',
  };
  const regionUpdateData3: Partial<Region> = {
    initials: 'Global_03',
    name: 'Global 03',
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
  it(`${regionUrl}/ (Post) Cria nova região`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(regionUrl)).send(regionToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    // Verifica se initials foi registrada com o nome em minusculo
    expect(result.body.entity.initials).toEqual(initialsRegionCheck);

    uuidRegionSaved = result.body.entity.uuid;
  });

  it(`${regionUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${regionUrl}/${uuidRegionSaved}`;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidRegionSaved);
    expect(result.body.initials).toEqual(initialsRegionCheck);
  });

  it(`${regionUrl}/ (Post) Tenta criar a mesma região (não pode)`, async () => {
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).post(regionUrl).send(regionToCreate)).expect(500);
  });

  it(`${regionUrl}/ (Put) Atualiza o "name" da região`, async () => {
    const updateUrl = `${regionUrl}/${uuidRegionSaved}`;
    const regionUpdate = {
      ...regionToCreate,
      entity: {
        ...regionToCreate.entity,
        initials: undefined,
        name: regionUpdateData2.name,
        uuid: uuidRegionSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(regionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRegionSaved);
    expect(result.body.entity.initials).not.toBeTruthy();
    expect(result.body.entity.name).toEqual(regionUpdateData2.name);
  });

  it(`${regionUrl}/ (Put) Atualiza a "initials" da região (ignora novo valor)`, async () => {
    const updateUrl = `${regionUrl}/${uuidRegionSaved}`;
    const findByUrl = `${regionUrl}/${uuidRegionSaved}`;

    const regionUpdate = {
      ...regionToCreate,
      entity: {
        ...regionToCreate.entity,
        initials: regionUpdateData3.initials,
        name: regionUpdateData3.name,
        uuid: uuidRegionSaved,
      },
    };
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).put(updateUrl)).send(regionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRegionSaved);
    expect(result.body.entity.name).toEqual(regionUpdateData3.name);

    const result2 = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(findByUrl)).expect(200);
    expect(result2.body).toBeDefined();
    expect(result2.body.uuid).toEqual(uuidRegionSaved);
    expect(result2.body.name).toEqual(regionUpdateData3.name);
    // Valores que não podem ser alterados
    expect(result2.body.initials).toEqual(initialsRegionCheck);
  });

  it(`${regionUrl}/ (Get) Busca as regiões`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(regionUrl)).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  it(`${regionUrl}/ (Get) Busca as regiões pelo id`, async () => {
    const result = await addGlobalIAMMgtRequestHeader(addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(regionUrl)))
      .query({ where: { uuid: uuidRegionSaved } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].uuid).toEqual(uuidRegionSaved);
  });

  it(`${regionUrl}/ (Get) Busca as regiões pelo initials`, async () => {
    const initials = initialsRegionCheck;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(regionUrl))
      .query({ where: { initials: initials } })
      .expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
  });

  it(`${regionUrl}/ (Delete) Remover registro`, async () => {
    const deleteUrl = `${regionUrl}/${uuidRegionSaved}`;

    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).delete(deleteUrl)).expect(200);
  });

  it(`${regionUrl}/ (Get) Busca região (principal) com "applications"`, async () => {
    const initials = iamConfig.MAIN_REGION;
    const result = await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(regionUrl))
      .query({
        where: { initials: initials },
        populate: ['applications', 'createdBy', 'updatedBy'],
      })
      .expect(200);

    expect(result.body).toBeTruthy();
    expect(result.body.length).toEqual(1);
    expect(result.body[0].initials).toEqual(initials);
    expect(result.body[0].applications.length).toBeGreaterThanOrEqual(2);
    expect(result.body[0].applications).toContainEqual(expect.objectContaining({ initials: iamConfig.MAIN_APP_IAM }));
    expect(result.body[0].applications).toContainEqual(expect.objectContaining({ initials: iamConfig.MAIN_APP_IAM_MGT }));
    expect(result.body[0].createdBy).toBeTruthy();
    expect(result.body[0].updatedBy).toBeTruthy();
  });

  it(`${regionUrl}/ (Get) Busca região (principal) com "applications" e "applications.regions" (não pode)`, async () => {
    const initials = iamConfig.MAIN_REGION;
    await addGlobalIAMMgtRequestHeader(request(app.getHttpServer()).get(regionUrl))
      .query({
        where: { initials: initials },
        populate: ['applications', 'applications.regions'],
      })
      .expect(400);
  });
});