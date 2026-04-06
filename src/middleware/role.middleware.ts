import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Forbidden: ${roles.join(' or ')} role required`);
    }

    next();
  };
};
