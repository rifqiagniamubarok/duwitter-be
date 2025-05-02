import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';

export const get_all_account_example = async () => {
  const accounts = await prisma.account_example.findMany();
  return accounts;
};

interface AccountCreateRequest {
  name: string;
  description: string | null;
  currency: string | null;
  icon: string | null;
  color: string | null;
  bg_color: string | null;
  balance: number;
}

export const create_new_account = async (space_id: string, request: AccountCreateRequest) => {
  const payload = { ...request, space_id };

  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.create({
      data: payload,
    });

    if (request.balance != 0 && request.balance != null) {
      await tx.transaction.create({
        data: {
          title: 'DIFFERENCE',
          account_id: account.account_id,
          amount: request.balance,
          type: request.balance > 0 ? 'INCOME' : 'EXPENSE',
        },
      });
    }

    return account;
  });

  return result;
};

export const edit_existing_account = async (account_id: string, space_id: string, request: AccountCreateRequest) => {
  const payload = { ...request };

  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: {
        account_id,
        space_id,
      },
    });

    if (!account) {
      throw new Response_error(404, 'Account not found');
    }

    if (account.balance != 0 && account.balance != null) {
      await tx.transaction.create({
        data: {
          title: 'DIFFERENCE',
          account_id,
          amount: request.balance,
          type: request.balance > 0 ? 'INCOME' : 'EXPENSE',
        },
      });
    }

    const account_updated = await prisma.account.update({
      where: {
        account_id,
      },
      data: payload,
    });

    return account_updated;
  });

  return result;
};

export const get_all_account_in_space = async (space_id: string) => {
  const accounts = await prisma.account.findMany({
    where: {
      space_id,
    },
  });
  return accounts;
};

export const get_account_by_id = async (account_id: string, space_id: string) => {
  const account = await prisma.account.findFirst({
    where: {
      account_id,
      space_id,
    },
  });

  if (!account) {
    throw new Response_error(404, 'Account not found');
  }

  return account;
};
