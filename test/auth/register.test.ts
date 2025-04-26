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

describe('auth test', () => {
  const api_url = '/api/v1';
  const first_name = 'test';
  const last_name = 'last_name';
  const email = 'test@yopmail.com';
  const password = 'testtest';

  // afterAll(async () => {
  //   await reset_db(email);
  // });

  beforeAll(async () => {
    await reset_db(email);
  });

  test('confirm password not match', async () => {
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: 'notmatch',
    });
    expect(response.status).toBe(400);
  });

  test('password without uppercase,number,symbol', async () => {
    const response = await supertest(app).post(`${api_url}/register`).send({
      first_name,
      last_name,
      email,
      password: password,
      confirm_password: password,
    });
    expect(response.status).toBe(400);
  });

  test('password without number,symbol', async () => {
    const response = await supertest(app)
      .post(`${api_url}/register`)
      .send({
        first_name,
        last_name,
        email,
        password: password + 'A',
        confirm_password: password + 'A',
      });
    expect(response.status).toBe(400);
  });

  test('password without symbol', async () => {
    const response = await supertest(app)
      .post(`${api_url}/register`)
      .send({
        first_name,
        last_name,
        email,
        password: password + 'A1',
        confirm_password: password + 'A1',
      });
    expect(response.status).toBe(400);
  });

  test('register true condition', async () => {
    const response = await supertest(app)
      .post(`${api_url}/register`)
      .send({
        first_name,
        last_name,
        email,
        password: password + 'A1$',
        confirm_password: password + 'A1$',
      });
    console.log(response.body);
    expect(response.status).toBe(201);
  });
});
