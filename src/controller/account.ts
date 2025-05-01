import type { Response, Request, NextFunction } from 'express';
import { create_new_account, get_all_account_example } from '../service/account';
import { create_account_request_validation } from '../validation/account';

export const account_example = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Service
    const data = await get_all_account_example();

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create_account = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Validation

    const parsedData = create_account_request_validation.parse(req.body);
    const { name, description, currency, icon, color, bg_color, balance } = parsedData;

    if (!name) {
      return res.status(400).json({ success: false, error_msg: 'Name is required.' });
    }

    // Service
    const data = await create_new_account(req.space_id as string, {
      name,
      description: description || null,
      currency,
      icon: icon || null,
      color,
      bg_color,
      balance,
    });

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
