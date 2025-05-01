import type { NextFunction, Request, Response } from 'express';

export const fullauth_middleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const error_msg = {
    success: false,
    error_msg: 'Unauthorized',
  };
  try {
    const is_profile_required = req.is_profile_required;
    if (!is_profile_required) {
      return res.status(401).json(error_msg);
    }
    next();
  } catch (error) {
    return res.status(401).json(error_msg);
  }
};
