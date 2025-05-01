import supertest from 'supertest';
import { app } from '../../src/app/app';
import { prisma } from '../../src/lib/prisma';

const api_url = '/api/v1/auth';
const first_name = 'testforuser';
const last_name = 'last_name';
const email = 'authfor@yopmail.com';
const password = 'testForTesting123!';

export const get_token_auth_for_testing = async () => {
  await supertest(app).post(`${api_url}/register`).send({
    first_name,
    last_name,
    email,
    password,
    confirm_password: password,
  });

  const { body } = await supertest(app).post(`${api_url}/login`).send({
    email,
    password,
    remember_me: 'N',
  });

  const token = body.data.token;

  return token;
};

export const clear_token_auth_for_testing = async () => {
  await prisma.user.deleteMany({
    where: {
      email: email,
    },
  });
};
