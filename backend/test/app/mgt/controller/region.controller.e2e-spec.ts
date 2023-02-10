import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app/app.module';
import { Region } from '../../../../src/model/System/Region';
import { EntityProps } from '../../../../src/app/mgt/types/crud.controller';

describe('RegionController (e2e)', () => {
  const reginUrl = '/mgt/region';
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${reginUrl}/ (Post) Cria nova região`, async () => {
    const region: EntityProps<Region> = {
      entity: {
        initials: 'Global',
        name: 'Global',
        description: 'Região de aplicações com único servidor',
      },
      user: {},
    };
    const result = await request(app.getHttpServer()).post(reginUrl).send(region).expect(201);

    expect(result.body.user).toBeDefined();
    expect(result.body.entity).toBeDefined();
    expect(result.body.entity.uuid).toBeTruthy();
  });

  it(`${reginUrl}/ (Get) Busca as regões`, () => {
    return request(app.getHttpServer()).get(reginUrl).expect(200).expect([]);
  });
});
