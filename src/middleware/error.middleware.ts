import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ZodError) {
    return sendError(res, 400, 'Validation Error', err.errors);
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    return sendError(res, 409, 'Conflict: Duplicate entry');
  }

  return sendError(res, 500, 'Internal Server Error');
};
