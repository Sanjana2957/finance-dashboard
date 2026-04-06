import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getMe = async (req: Request, res: Response) => {
  // The requireAuth middleware already added req.user
  return sendSuccess(res, req.user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // For this enterprise demo, we'll validate email and password
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return sendError(res, 401, 'Identity not found in enterprise registry.');
  }

  // Check if user is active
  if (!(user as any).isActive) {
    return sendError(res, 403, 'Account is currently deactivated.');
  }

  // Simple password check for demo
  if (password !== (user as any).password) {
    return sendError(res, 401, 'Invalid security credentials.');
  }

  // return user data (in a real app we'd send a JWT)
  return sendSuccess(res, {
    token: user.id, // using ID as token for this demo's x-user-id pattern
    user
  }, 'Access Granted');
};
