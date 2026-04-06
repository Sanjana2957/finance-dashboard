import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be strictly positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().datetime().or(z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })),
  description: z.string().optional()
});

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().or(z.string().refine((val) => !isNaN(Date.parse(val)))).optional(),
  description: z.string().optional()
});
