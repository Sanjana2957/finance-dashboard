import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import prisma from '../prisma/client';

export const getHealth = async (req: Request, res: Response) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'disconnected';
  }

  return sendSuccess(res, {
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};
