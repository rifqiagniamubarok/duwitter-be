import { prisma } from '../lib/prisma';

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
  balance: number | null;
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
