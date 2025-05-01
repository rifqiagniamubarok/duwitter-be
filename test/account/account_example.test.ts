import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { prisma } from '../../src/lib/prisma';
import { clear_token_auth_for_testing, get_token_auth_for_testing } from '../auth/utils';

describe('account_example testing', () => {
  const api_url = '/api/v1/account';
  let token = '';
  beforeAll(async () => {
    await clear_token_auth_for_testing();
    token = await get_token_auth_for_testing();
  });

  test('PC: get all account example', async () => {
    const { body, status } = await supertest(app).get(`${api_url}/example`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: expect.any(Array),
    });
  });
});
