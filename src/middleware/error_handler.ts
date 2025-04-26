import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Response_error } from '../utils/response_error';
const env = process.env.NODE_ENV || 'development';
const in_test = process.env.IN_TEST || 'false';
const isDev = env === 'development';
const isTest = in_test === 'true';

export const error_handler = async (error: Error, req: Request, res: Response, next: NextFunction): Promise<any> => {
  !isTest && console.log('Error:', error);
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error_msg: error.issues[0]?.message,
      errors: error.issues,
    });
  } else if (error instanceof Response_error) {
    if (isDev && error.status === 500) {
      return res.status(500).json({
        success: false,
        errors: [{ message: 'Opps, something error. try again later' }],
      });
    }
    return res.status(error.status).json({
      success: false,
      errors: [{ message: error.message }],
    });
  } else {
    if (isDev) {
      return res.status(500).json({
        success: false,
        errors: [{ message: 'Opps, something error. try again later' }],
      });
    }
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};
