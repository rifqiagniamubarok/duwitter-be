import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Response_error } from '../utils/response_error';
import { logger } from '../app/logging';
const env = process.env.NODE_ENV || 'development';
const in_test = process.env.IN_TEST || 'false';
const isDev = env === 'development';
const isTest = in_test === 'true';

const error_ticket = (status: number) => {
  // Generate 4 random uppercase alphabets
  let randomChars = '';
  for (let i = 0; i < 4; i++) {
    randomChars += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  const timestamp = new Date().getTime();
  const ticket = `${timestamp}-${String(status)}-${randomChars}`;
  return ticket;
};

export const error_handler = async (error: Error, req: Request, res: Response, next: NextFunction): Promise<any> => {
  // !isTest && console.log('Error:', error);
  if (error instanceof ZodError) {
    !isTest &&
      logger.error({
        type: 'ZOD_ERROR',
        in_test: isTest,
        code: 400,
        code_ticket: error_ticket(400),
        errors: error,
      });
    return res.status(400).json({
      success: false,
      error_msg: error.issues[0]?.message,
      errors: error.issues,
    });
  } else if (error instanceof Response_error) {
    if (isDev && error.status === 500) {
      logger.error({
        type: 'CUSTOM_ERROR',
        in_test: isTest,
        code: error.status,
        code_ticket: error_ticket(500),
        errors: error,
      });
      return res.status(500).json({
        success: false,
        code_ticket: error_ticket(error.status),
        errors: [{ message: 'Opps, something error. try again later' }],
      });
    }
    !isTest &&
      logger.error({
        type: 'CUSTOM_ERROR',
        in_test: isTest,
        code: error.status,
        errors: error,
      });
    return res.status(error.status).json({
      success: false,
      errors: [{ message: error.message }],
    });
  } else {
    logger.error({
      type: 'INTERNAL_SERVER_ERROR',
      code: 500,
      code_ticket: error_ticket(500),
      in_test: isTest,
      error,
    });

    if (isDev) {
      return res.status(500).json({
        code_ticket: error_ticket(500),
        success: false,
        errors: [{ message: 'Opps, something error. try again later' }],
      });
    }

    return res.status(500).json({
      success: false,
      code_ticket: error_ticket(500),
      errors: error,
    });
  }
};
