import type { NextFunction, Request, Response } from 'express';
import { transaction_request_validation } from '../validation/transaction';
import { create_new_transaction } from '../service/transaction';
import { Response_error } from '../utils/response_error';

export const create_transaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parseBody = transaction_request_validation.parse(req.body);

    const result = await create_new_transaction(req.space_id as string, parseBody);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
