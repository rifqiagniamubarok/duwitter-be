import type { NextFunction, Request, Response } from 'express';
import { login_request_validation, login_reset_token_validation, register_requeest_validation } from '../validation/user';
import { create_new_user, login_user_with_password, login_user_with_remember_token } from '../service/user';

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = login_request_validation.parse(req.body);
    const { email, password, remember_me } = parsedData;

    // Login service
    const data = await login_user_with_password({ email, password, remember_me });

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const login_remember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = login_reset_token_validation.parse(req.body);
    const { email, token } = parsedData;

    // Login service
    const data = await login_user_with_remember_token({ email, token });

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
