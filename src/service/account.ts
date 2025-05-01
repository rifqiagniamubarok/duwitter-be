import { prisma } from '../lib/prisma';

export const get_all_account_example = async () => {
  const accounts = await prisma.account_example.findMany();
  return accounts;
};

export const create_account = async (request: {}) => {};
