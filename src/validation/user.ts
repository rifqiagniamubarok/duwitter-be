import { z } from 'zod';

export const password_validation = z
  .string()
  .min(6, 'Password must be at least 6 characters long.')
  .max(20, 'Password must not exceed 20 characters.')
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter.',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter.',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number.',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Password must contain at least one special character (!@#$%^&*).',
  });

export const register_requeest_validation = z
  .object({
    first_name: z.string().min(1, 'First name is required.').max(20, 'First name must not exceed 20 characters.'),
    last_name: z.string().min(1, 'Last name is required.').max(20, 'Last name must not exceed 20 characters.'),
    email: z.string().email('Please provide a valid email address.'),
    password: password_validation,
    confirm_password: password_validation,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match. Please ensure both passwords are the same.',
  });

export const login_request_validation = z.object({
  email: z.string().email('Please provide a valid email address.').min(1, 'Email is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.').min(8, 'Password must not exceed 8 characters.').max(20, 'Password must not exceed 20 characters.'),
  remember_me: z.enum(['Y', 'N']).optional().default('N'),
});

export const login_reset_token_validation = z.object({
  email: z.string().email('Please provide a valid email address.').min(1, 'Email is required.'),
  token: z.string().min(1, 'Email is required.'),
});
