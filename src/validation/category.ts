import { z } from 'zod';

export const create_category_request_validation = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable().optional(),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Type is required' }),
  }),
  icon: z.string().nullable().optional(),
  subcategories: z
    .array(
      z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        description: z.string().nullable().optional(),
        icon: z.string().nullable().optional(),
      })
    )
    .min(1, { message: 'Subcategory is required' }),
});

export const edit_category_request_validation = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

export const edit_subcategory_request_validation = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});
