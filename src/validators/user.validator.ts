import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['viewer', 'analyst', 'admin']),
  status: z.enum(['active', 'inactive'])
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  status: z.enum(['active', 'inactive']).optional()
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['viewer', 'analyst', 'admin'])
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'inactive'])
});
