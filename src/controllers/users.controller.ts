import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return sendSuccess(res, users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });
  if (!user) return sendError(res, 404, 'User not found');
  return sendSuccess(res, user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, role, isActive, password } = req.body;
  
  const user = await prisma.user.create({
    data: {
      id: `u${Date.now()}`,
      name,
      email,
      role: role || 'viewer',
      password: password || 'password123',
      isActive: isActive !== undefined ? (isActive as any) : true
    }
  });
  
  return sendSuccess(res, user, 'Member enrolled successfully', 201);
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, role, isActive, password } = req.body;

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(password && { password }),
      ...(isActive !== undefined && { isActive: (isActive as any) })
    }
  });

  return sendSuccess(res, user, 'Profile updated successfully');
};

export const updateRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['viewer', 'analyst', 'admin'].includes(role)) {
    return sendError(res, 400, 'Invalid role');
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role }
  });

  return sendSuccess(res, user);
};

export const toggleStatus = async (req: Request, res: Response) => {
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) return sendError(res, 404, 'User not found');

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: (!(existing as any).isActive as any) }
  });

  return sendSuccess(res, user);
};
