import { date, z } from 'zod';

export interface transaction_request_type {
  account_id: string;
  title: string;
  note?: string | null;
  subcategory_id: string;
  amount: number;
  currency?: string | null;
  date?: Date;
}

export const transaction_request_validation = z.object({
  account_id: z.string().min(1, { message: 'Account is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  note: z.string().nullable().optional(),
  subcategory_id: z.string().min(1, { message: 'Subcategory is required' }),
  amount: z.number().min(0.01, { message: 'Amount is required' }),
  currency: z.string().nullable().optional().default('IDR'),
  date: z.coerce.date(),
});
