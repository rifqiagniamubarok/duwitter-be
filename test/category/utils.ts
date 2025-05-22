import supertest from 'supertest';
import { app } from '../../src/app/app';

const api_url = '/api/v1/category';

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

export const create_category_income_for_testing = async (token: string): Promise<{ category_id: string; subcategory_id: string } | undefined> => {
  try {
    const { body } = await supertest(app)
      .post(`${api_url}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...payload,
        type: 'INCOME',
      });

    return { category_id: body.data.category_id, subcategory_id: body.data.subcategories[0].subcategory_id };
  } catch (error) {
    console.error('Error creating category for testing:', error);
  }
};

export const create_category_expense_for_testing = async (token: string): Promise<{ category_id: string; subcategory_id: string } | undefined> => {
  try {
    const { body } = await supertest(app)
      .post(`${api_url}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...payload,
        type: 'EXPENSE',
      });

    return { category_id: body.data.category_id, subcategory_id: body.data.subcategories[0].subcategory_id };
  } catch (error) {
    console.error('Error creating category for testing:', error);
  }
};
