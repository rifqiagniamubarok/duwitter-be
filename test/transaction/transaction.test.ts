import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { clear_token_auth_for_testing, get_token_auth_for_testing } from '../auth/utils';
import { create_account_for_testing } from '../account/utils';
import { create_category_expense_for_testing, create_category_income_for_testing } from '../category/utils';
import supertest from 'supertest';
import { app } from '../../src/app/app';
import { date } from 'zod';
import dayjs from 'dayjs';
import { sleep } from 'bun';

describe('Transaction Testing', async () => {
  const api_url = '/api/v1/transaction';
  let token = '';
  let account_id = '';
  const category_income = {
    category_id: '',
    subcategory_id: '',
  };
  const category_expense = {
    category_id: '',
    subcategory_id: '',
  };

  //   let pyaload = {
  //     account_id: '',
  //     amount: 100,
  //     date: new Date(),
  //     description: 'Test Transaction',
  //     subcategory_id: '',
  //   };

  beforeAll(async () => {
    await clear_token_auth_for_testing();
    token = await get_token_auth_for_testing();
    account_id = await create_account_for_testing(token);
    const income = await create_category_income_for_testing(token);
    const expense = await create_category_expense_for_testing(token);

    category_income.category_id = income?.category_id || '';
    category_income.subcategory_id = income?.subcategory_id || '';
    category_expense.category_id = expense?.category_id || '';
    category_expense.subcategory_id = expense?.subcategory_id || '';
  });

  test('PC: Create income transaction ', async () => {
    const payload = {
      account_id: account_id,
      amount: 100,
      title: 'Test Transaction INCOME',
      note: 'Test Transaction',
      subcategory_id: category_income.subcategory_id,
      date: new Date(),
    };
    const { status, body } = await supertest(app).post(`${api_url}`).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.transaction_id).toBeDefined();
    expect(body.data.account.account_id).toBe(payload.account_id);
    expect(body.data.account.balance).toBe(100);
  });

  test('PC: Create expense transaction ', async () => {
    const payload = {
      account_id: account_id,
      amount: 50,
      title: 'Test Transaction EXPENSE',
      note: 'Test Transaction',
      subcategory_id: category_expense.subcategory_id,
      date: new Date(),
    };
    const { status, body } = await supertest(app).post(`${api_url}`).set('Authorization', `Bearer ${token}`).send(payload);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.transaction_id).toBeDefined();
    expect(body.data.account.account_id).toBe(payload.account_id);
    expect(body.data.account.balance).toBe(50);
    await sleep(1000);
  });
});
