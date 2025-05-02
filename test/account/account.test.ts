import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { prisma } from '../../src/lib/prisma';
import { clear_token_auth_for_testing, get_token_auth_for_testing } from '../auth/utils';

describe('account testing', () => {
  const api_url = '/api/v1/account';
  let token = '';
  let account_id = '';

  beforeAll(async () => {
    await clear_token_auth_for_testing();
    token = await get_token_auth_for_testing();
  });

  const account_payload = {
    name: 'BCA',
    currency: 'IDR',
    balance: 0,
  };

  test('PC: get all account example', async () => {
    const { body, status } = await supertest(app).get(`${api_url}/example`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: expect.any(Array),
    });
  });

  test('PC: create account', async () => {
    const { body, status } = await supertest(app)
      .post(`${api_url}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...account_payload,
      });

    account_id = body.data.account_id;

    expect(status).toBe(200);
  });

  test('NC: create account with invalid type', async () => {
    const { body, status } = await supertest(app)
      .post(`${api_url}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...account_payload,
        type: 'DEBIT_WRONG',
      });

    expect(status).toBe(400);
  });

  test('PC: edit account', async () => {
    account_payload.name = 'BCA 2';
    const { body, status } = await supertest(app)
      .put(`${api_url}/${account_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...account_payload,
      });

    expect(body.data.name).toBe(account_payload.name);
    expect(status).toBe(200);
  });

  test('PC: get all acount', async () => {
    const { body, status } = await supertest(app).get(`${api_url}`).set('Authorization', `Bearer ${token}`);
    expect(body).toEqual({
      success: true,
      data: expect.any(Array),
    });
    expect(status).toBe(200);
  });

  test('PC: get detail acount', async () => {
    const { body, status } = await supertest(app).get(`${api_url}/${account_id}`).set('Authorization', `Bearer ${token}`);
    expect(body.data.name).toBe(account_payload.name);
    expect(status).toBe(200);
  });
});
