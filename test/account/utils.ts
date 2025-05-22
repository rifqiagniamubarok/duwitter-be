import supertest from 'supertest';
import { app } from '../../src/app/app';

const api_url = '/api/v1/account';

const account_payload = {
  name: 'MANDIRI',
  currency: 'IDR',
  balance: 0,
};

export const create_account_for_testing = async (token: string) => {
  try {
    const { body } = await supertest(app)
      .post(`${api_url}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...account_payload,
      });

    return body.data.account_id;
  } catch (error) {
    console.error('Error creating account for testing:', error);
  }
};
