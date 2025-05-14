import { describe, test, expect, beforeAll } from 'bun:test';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { clear_token_auth_for_testing, get_token_auth_for_testing } from '../auth/utils';

describe('Testing API', async () => {
  const api_url = '/api/v1';
  let token = '';

  beforeAll(async () => {
    await clear_token_auth_for_testing();
    token = await get_token_auth_for_testing();
  });

  test('public api', async () => {
    const { body, status } = await supertest(app).get(`${api_url}/public-api-test`);
    expect(status).toBe(200);
    expect(body.status).toBe('ok');
  });
  test('protected api', async () => {
    const { body, status } = await supertest(app).get(`${api_url}/protected-api-test`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.status).toBe('ok');
  });
});
