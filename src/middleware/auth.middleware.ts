import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { sendError } from '../utils/apiResponse';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return sendError(res, 401, 'Unauthorized: Missing x-user-id header');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return sendError(res, 401, 'Unauthorized: User not found');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Forbidden: User is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
