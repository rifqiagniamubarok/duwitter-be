import { z } from 'zod';

export const currency_enum = z.enum(['IDR']).optional().nullable().default('IDR');
export const type_account_enum = z.enum(['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'BANK', 'E_WALLET', 'INVESTMENT', 'LOAN']).optional().nullable().default('CASH');

export const create_account_request_validation = z.object({
  name: z.string().min(1, 'Name is required.').max(20, 'Name must not exceed 20 characters.'),
  description: z.string().optional().nullable(),
  currency: currency_enum,
  type: type_account_enum,
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable().default('#FFFF'),
  bg_color: z.string().optional().nullable().default('#000000'),
  balance: z.number().optional().nullable().default(0),
});
