import type { Response, Request, NextFunction } from 'express';
import { create_new_account, edit_existing_account, get_account_by_id, get_all_account_example, get_all_account_in_space } from '../service/account';
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
      balance: balance || 0,
    });

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const edit_account = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Validation
    const parsedData = create_account_request_validation.parse(req.body);
    const { name, description, currency, icon, color, bg_color, balance } = parsedData;

    if (!name) {
      return res.status(400).json({ success: false, error_msg: 'Name is required.' });
    }

    // Service
    const data = await edit_existing_account(req.params.account_id as string, req.space_id as string, {
      name,
      description: description || null,
      currency,
      icon: icon || null,
      color,
      bg_color,
      balance: balance || 0,
    });

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const get_all_account = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await get_all_account_in_space(req.space_id as string);

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const get_detail_account = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await get_account_by_id(req.params.account_id as string, req.space_id as string);

    // Response
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
