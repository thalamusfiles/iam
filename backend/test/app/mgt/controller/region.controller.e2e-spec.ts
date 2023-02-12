import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Region } from '../../../../src/model/System/Region';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';
import { User } from '../../../../src/model/User';

describe('RegionController (e2e)', () => {
  const regionUrl = '/mgt/region';
  let app: INestApplication;
  let uuidRegion = null;
  const adminUser: User = { uuid: '11111111-1111-1111-1111-111111111111' } as User;
  const regionToCreate: EntityProps<Region> = {
    entity: {
      initials: 'Global',
      name: 'Global',
      description: 'Região de aplicações com único servidor',
      createdBy: adminUser,
      updatedBy: adminUser,
    },
    user: {},
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${regionUrl}/ (Post) Cria nova região`, async () => {
    const result = await request(app.getHttpServer()).post(regionUrl).send(regionToCreate).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();

    uuidRegion = result.body.entity.uuid;
  });

  /*it(`${regionUrl}/ (Get) Coleta registro criado`, async () => {
    const findByUrl = `${regionUrl}/${uuidRegion}`;
    const result = await request(app.getHttpServer()).get(findByUrl).send(regionToCreate).expect(200);

    expect(result.body).toBeDefined();
    expect(result.body.uuid).toEqual(uuidRegion);
  });

  it(`${regionUrl}/ (Post) Tenta criar a mesma região (não pode)`, async () => {
    await request(app.getHttpServer()).post(regionUrl).send(regionToCreate).expect(400);
  });

  it(`${regionUrl}/ (Put) Atualiza a região`, async () => {
    const regionUpdate = { ...regionToCreate, entity: { ...regionToCreate.entity, uuid: uuidRegion } };
    const updateUrl = `${regionUrl}/${uuidRegion}`;
    const result = await request(app.getHttpServer()).put(updateUrl).send(regionUpdate).expect(200);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();

    uuidRegion = result.body.entity.uuid;
  });

  it(`${regionUrl}/ (Get) Busca as regões`, async () => {
    const result = await request(app.getHttpServer()).get(regionUrl).expect(200).expect([]);
    //console.log(result.body);
  });*/
});
