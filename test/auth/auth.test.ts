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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('auth test', () => {
  const api_url = '/api/v1';
  const first_name = 'test';
  const last_name = 'last_name';
  const email = 'test@yopmail.com';
  let password = 'testtest';
  let past_token = '';
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
    });

    token = response.body.data.token;

    expect(response.status).toBe(200);
    await sleep(1000);
  });

  test('PC: login with reset token ', async () => {
    const response = await supertest(app).post(`${api_url}/login`).send({
      email,
      reset_token: token,
    });

    expect(response.status).toBe(200);
  });

  test('NC: login with reset wrong token ', async () => {
    const response = await supertest(app).post(`${api_url}/login`).send({
      email,
      reset_token: token,
    });

    expect(response.status).toBe(400);
  });
});
