import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { clear_token_auth_for_testing, get_token_auth_for_testing } from '../auth/utils';
import { logger } from '../../src/app/logging';

describe('Category testing', () => {
  const api_url = '/api/v1/category';

  let token = '';
  const payload: any = {
    name: 'Test Category',
    description: 'Test Description',
    type: 'INCOME',
    icon: 'test-icon',
    subcategories: [
      {
        name: 'Subcategory 1',
        description: 'Subcategory 1 Description',
        icon: 'subcategory-icon-1',
      },
      {
        name: 'Subcategory 2',
        description: 'Subcategory 2 Description',
        icon: 'subcategory-icon-2',
      },
    ],
  };

  let category_id = '';
  let subcategory_id = '';

  beforeAll(async () => {
    await clear_token_auth_for_testing();
    token = await get_token_auth_for_testing();
  });

  test('PC: create income category', async () => {
    const { status, body } = await supertest(app).post(api_url).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Test Category');
    expect(body.data.description).toBe('Test Description');
    expect(body.data.type).toBe('INCOME');
    expect(body.data.icon).toBe('test-icon');
    expect(body.data.subcategories.length).toBe(2);
  });

  test('NC: create category with invalid type', async () => {
    payload.type = 'income'; // Set an invalid type
    const { status } = await supertest(app).post(api_url).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(400);
  });

  test('PC: create expense category', async () => {
    payload.type = 'EXPENSE';
    const { status, body } = await supertest(app).post(api_url).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Test Category');
    expect(body.data.description).toBe('Test Description');
    expect(body.data.type).toBe('EXPENSE');
    expect(body.data.icon).toBe('test-icon');
    expect(body.data.subcategories.length).toBe(2);

    category_id = body.data.category_id;
    subcategory_id = body.data.subcategories[0].subcategory_id;
  });

  test('PC: create category with null optional request', async () => {
    payload.icon = null; // Set icon to null
    payload.description = null; // Set description to null

    const { status, body } = await supertest(app).post(api_url).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Test Category');
    expect(body.data.description).toBe(null);
    expect(body.data.type).toBe('EXPENSE');
    expect(body.data.icon).toBe(null);
    expect(body.data.subcategories.length).toBe(2);
  });

  test('PC: edit category', async () => {
    const { status, body } = await supertest(app).put(`${api_url}/${category_id}`).set('Authorization', `Bearer ${token}`).send({
      name: 'Updated Category',
      description: 'Updated Description',
      icon: 'updated-icon',
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Updated Category');
    expect(body.data.description).toBe('Updated Description');
    expect(body.data.icon).toBe('updated-icon');
    expect(body.data.category_id).toBe(category_id);
  });

  test('PC: edit subcategory', async () => {
    const { status, body } = await supertest(app).put(`${api_url}/subcategory/${subcategory_id}`).set('Authorization', `Bearer ${token}`).send({
      name: 'Updated Subcategory',
      description: 'Updated Subcategory Description',
      icon: 'updated-subcategory-icon',
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Updated Subcategory');
    expect(body.data.description).toBe('Updated Subcategory Description');
    expect(body.data.icon).toBe('updated-subcategory-icon');
    expect(body.data.subcategory_id).toBe(subcategory_id);
  });

  test('PC: get all categories expense', async () => {
    const { status, body } = await supertest(app).get(api_url).set('Authorization', `Bearer ${token}`).query({
      type: 'EXPENSE',
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('PC: get all categories income', async () => {
    const { status, body } = await supertest(app).get(api_url).set('Authorization', `Bearer ${token}`).query({
      type: 'INCOME',
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('PC: get category by ID', async () => {
    const { status, body } = await supertest(app).get(`${api_url}/${category_id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.category_id).toBe(category_id);
  });
});
