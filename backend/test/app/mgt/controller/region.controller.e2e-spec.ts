import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Region } from '../../../../src/model/System/Region';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { User } from '../../../../src/model/User';

describe('RegionController (e2e)', () => {
  let app: INestApplication;

  // Registros utilizado nos testes
  const regionUrl = '/mgt/region';
  const adminUserUuid = '11111111-1111-1111-1111-111111111111';
  const regionToCreate: EntityProps<Region> = {
    entity: {
      initials: 'Global',
      name: 'Global',
      description: 'Região de aplicações com único servidor',
      createdBy: adminUserUuid as any as User,
      updatedBy: adminUserUuid as any as User,
    },
    user: {},
  };
  let uuidRegionSaved = null;
  const regionUpdateData: Partial<Region> = {
    initials: 'Global_02',
    name: 'Global 02',
  };

  // Executa antes de cada teste
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Inicio dos testes
  it(`Limpar registros de testes`, async () => {
    const result = await request(app.getHttpServer()).get(regionUrl);
    if (result.body && result.body[0]) {
      await request(app.getHttpServer()).delete(`${regionUrl}/${result.body[0].uuid}`);
    }
  });

  it(`${regionUrl}/ (Post) Cria nova região`, async () => {
    const result = await request(app.getHttpServer()).post(regionUrl).send(regionToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();

    uuidRegionSaved = result.body.entity.uuid;
  });

  it(`${regionUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${regionUrl}/${uuidRegionSaved}`;
    const result = await request(app.getHttpServer()).get(findByUrl).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidRegionSaved);
  });

  it(`${regionUrl}/ (Post) Tenta criar a mesma região (não pode)`, async () => {
    await request(app.getHttpServer()).post(regionUrl).send(regionToCreate).expect(500);
  });

  it(`${regionUrl}/ (Put) Atualiza a região`, async () => {
    const updateUrl = `${regionUrl}/${uuidRegionSaved}`;
    const regionUpdate = {
      ...regionToCreate,
      entity: {
        ...regionToCreate.entity,
        ...regionUpdateData,
        uuid: uuidRegionSaved,
      },
    };
    const result = await request(app.getHttpServer()).put(updateUrl).send(regionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
    expect(result.body.entity.uuid).toEqual(uuidRegionSaved);
    expect(result.body.entity.name).toEqual(regionUpdateData.name);

    // Valores que não podem ser alterados
    //expect(result.body.entity.initials).toEqual(regionToCreate.entity.initials);

    uuidRegionSaved = result.body.entity.uuid;
  });

  it(`${regionUrl}/ (Get) Busca as regiões`, async () => {
    const result = await request(app.getHttpServer()).get(regionUrl).expect(200);
    expect(result.body).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
  });

  /*it(`${regionUrl}/ (Get) Busca as regões por id`, async () => {
    const result = await request(app.getHttpServer()).get(regionUrl).expect(200);
    expect(result.body).toBeGreaterThan(0);
  });*/
});
