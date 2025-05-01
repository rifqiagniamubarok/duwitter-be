import type { Response, Request, NextFunction } from 'express';
import { get_all_account_example } from '../service/account';

export const account_example = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Service
    const data = await get_all_account_example();

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create_account = async (req: Request, res: Response, next: NextFunction) => {};
