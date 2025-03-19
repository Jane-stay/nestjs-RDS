import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST) - should return an access token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'lala@naver.com', password: '123456' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('refreshToken');
      });
  });
});
