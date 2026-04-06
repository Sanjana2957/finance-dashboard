import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllRecords = async (req: Request, res: Response) => {
  const type = req.query.type as string;
  const category = req.query.category as string;
  const search = req.query.search as string;

  const records = await prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
      ...(type && { type }),
      ...(category && { category }),
      ...(search && { description: { contains: search } }),
    },
    orderBy: { createdAt: 'desc' },
    include: { createdBy: { select: { name: true } } }
  });

  return sendSuccess(res, records);
};

export const getRecordById = async (req: Request, res: Response) => {
  const record = await prisma.financialRecord.findUnique({
    where: { id: req.params.id }
  });
  if (!record || record.isDeleted) return sendError(res, 404, 'Record not found');
  return sendSuccess(res, record);
};

export const createRecord = async (req: Request, res: Response) => {
  const { amount, type, category, date, description } = req.body;
  
  if (amount <= 0) return sendError(res, 400, 'Amount must be greater than 0');

  const record = await prisma.financialRecord.create({
    data: {
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      description,
      createdById: req.user!.id
    }
  });

  return sendSuccess(res, record, 'Financial record posted successfully', 201);
};

export const updateRecord = async (req: Request, res: Response) => {
  const existing = await prisma.financialRecord.findUnique({
    where: { id: req.params.id }
  });
  if (!existing || existing.isDeleted) return sendError(res, 404, 'Record not found');

  const { amount, type, category, date, description } = req.body;

  const record = await prisma.financialRecord.update({
    where: { id: req.params.id },
    data: {
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(type && { type }),
      ...(category && { category }),
      ...(date && { date: new Date(date) }),
      ...(description && { description }),
    }
  });

  return sendSuccess(res, record);
};

export const deleteRecord = async (req: Request, res: Response) => {
  const existing = await prisma.financialRecord.findUnique({
    where: { id: req.params.id }
  });
  if (!existing || existing.isDeleted) return sendError(res, 404, 'Record not found');

  // Soft delete
  await prisma.financialRecord.update({
    where: { id: req.params.id },
    data: { isDeleted: true }
  });

  return sendSuccess(res, { message: 'Record deleted successfully' });
};
