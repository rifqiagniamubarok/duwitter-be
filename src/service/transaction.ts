import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';
import type { transaction_request_type } from '../validation/transaction';

export const create_new_transaction = async (space_id: string, payload: transaction_request_type) => {
  const result = await prisma.$transaction(async (tx) => {
    const is_exist_account = await tx.account.count({
      where: {
        account_id: payload.account_id,
        space_id,
      },
    });

    if (is_exist_account <= 0) {
      throw new Response_error(404, 'Account not found');
    }

    const subcategory = await tx.subcategory.findFirst({
      where: {
        subcategory_id: payload.subcategory_id,
      },
      include: {
        category: true,
      },
    });

    if (!subcategory) {
      throw new Response_error(404, 'Subcategory not found');
    }

    const type = subcategory.category.type;

    const transaction = await tx.transaction.create({
      data: { ...payload },
      select: {
        transaction_id: true,
        account_id: true,
        amount: true,
        date: true,
        title: true,
        note: true,
        subcategory_id: true,
        model: true,
      },
    });

    let account = null;

    if (type === 'INCOME') {
      account = await tx.account.update({
        where: {
          account_id: payload.account_id,
        },
        data: {
          balance: {
            increment: payload.amount,
          },
        },
      });
    } else if (type === 'EXPENSE') {
      account = await tx.account.update({
        where: {
          account_id: payload.account_id,
        },
        data: {
          balance: {
            decrement: payload.amount,
          },
        },
      });
    } else {
      throw new Response_error(400, 'Invalid transaction type');
    }

    return {
      ...transaction,
      type: type,
      account: {
        name: account.name,
        account_id: account.account_id,
        balance: account.balance,
        currency: account.currency,
      },
    };
  });

  return result;
};
