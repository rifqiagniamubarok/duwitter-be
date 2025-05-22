import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { prisma } from '../../src/lib/prisma';

const reset_db = async (email: string) => {
  await prisma.user.deleteMany({
    where: {
      email: email,
    },
  });
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('auth test', () => {
  const api_url = '/api/v1/auth';
  const first_name = 'test';
  const last_name = 'last_name';
  const email = 'test@yopmail.com';
  let password = 'testtest';
  let token = '';

  // afterAll(async () => {
  //   await reset_db(email);
  // });

  beforeAll(async () => {
    await reset_db(email);
  });

  test('NC: confirm password not match', async () => {
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: 'notmatch',
    });
    expect(response.status).toBe(400);
  });

  test('NC: password without uppercase,number,symbol', async () => {
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: password,
    });
    expect(response.status).toBe(400);
  });

  test('NC: password without number,symbol', async () => {
    password += 'A';
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: password,
    });
    expect(response.status).toBe(400);
  });

  test('NC: password without symbol', async () => {
    password += '1';
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: password,
    });
    expect(response.status).toBe(400);
  });

  test('PC: register new user', async () => {
    password += '$';
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: password,
    });
    expect(response.status).toBe(201);
  });

  test('PC: login with password ', async () => {
    const response = await supertest(app).post(`${api_url}/login`).send({
      email,
      password: password,
      remember_me: 'N',
    });

    token = response.body.data.token;

    expect(response.status).toBe(200);
  });

  test('NC: fail login with reset token without remember me before ', async () => {
    const { status } = await supertest(app).post(`${api_url}/login-remember`).send({
      email,
      token: token,
    });

    expect(status).toBe(400);
  });

  test('PC: login with password with remember me', async () => {
    const { status, body } = await supertest(app).post(`${api_url}/login`).send({
      email,
      password: password,
      remember_me: 'Y',
    });

    token = body.data.token;

    expect(status).toBe(200);
    await sleep(1000);
  });

  test('PC: login with reset token ', async () => {
    const { status } = await supertest(app).post(`${api_url}/login-remember`).send({
      email,
      token: token,
    });

    expect(status).toBe(200);
  });

  test('PC: re-login with password with remember me', async () => {
    const { status } = await supertest(app).post(`${api_url}/login`).send({
      email,
      password: password,
      remember_me: 'Y',
    });

    expect(status).toBe(200);
  });

  test('NC: login with wrong token (past token)', async () => {
    const { status, body } = await supertest(app).post(`${api_url}/login-remember`).send({
      email,
      token: token,
    });

    expect(status).toBe(400);
  });

  test('PC: test api with token', async () => {
    const { status } = await supertest(app).get(`/api/v1/protected-api-test`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(200);
  });
});
