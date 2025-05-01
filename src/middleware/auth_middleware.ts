import type { Response, Request, NextFunction } from 'express';
import { Response_error } from '../utils/response_error';
import { verify_token, type token_payload } from '../utils/jwt';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user_id?: string;
      space_id?: string;
      is_profile_required?: boolean;
      user?: token_payload;
    }
  }
}

export const auth_middleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const error_msg = {
    success: false,
    error_msg: 'Unauthorized',
  };

  try {
    const authorization = req.get('Authorization');
    if (!authorization) {
      return res.status(401).json(error_msg);
    }

    // Token verify
    const token = authorization.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json(error_msg);
    }

    const { ok, data } = await verify_token(token);
    if (!ok || data == null) throw new Error('Token has expired');

    // Add custom properties to req
    req.user_id = data.user_id;
    req.space_id = data.space_id;
    req.is_profile_required = data.is_profile_required;
    req.user = data;

    return next();
  } catch (error) {
    return res.status(401).json(error_msg);
  }
};
