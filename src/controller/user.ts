import { hash } from 'bcryptjs';
import { password } from 'bun';
import type { NextFunction, Request, Response } from 'express';
import { register_requeest_validation } from '../validation/user';
import { create_new_user } from '../service/user';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = register_requeest_validation.parse(req.body);
    const { first_name, last_name, email, password } = parsedData;

    // Create new user
    const data = await create_new_user({ first_name, last_name, email, password });

    // Repoonse
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
