import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess } from '../utils/apiResponse';

export const getSummary = async (req: Request, res: Response) => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false }
  });

  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = totalIncome - totalExpense;
  const transactionCount = records.length;

  return sendSuccess(res, {
    totalIncome,
    totalExpenses: totalExpense,
    netBalance: balance,
    totalRecords: transactionCount,
    activeUsers: 1 // Placeholder for demo
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false }
  });

  const categoriesMap: Record<string, { name: string, value: number, type: string }> = {};

  records.forEach(r => {
    if (!categoriesMap[r.category]) {
      categoriesMap[r.category] = { name: r.category, value: 0, type: r.type };
    }
    categoriesMap[r.category].value += r.amount;
  });

  return sendSuccess(res, Object.values(categoriesMap).map(c => ({
    category: c.name,
    amount: c.value,
    type: c.type
  })));
};

export const getTrends = async (req: Request, res: Response) => {
  // Simple trend: group by month
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'asc' }
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendsMap: Record<string, { name: string, income: number, expense: number }> = {};

  // Initialize with all months
  months.forEach(m => {
    trendsMap[m] = { name: m, income: 0, expense: 0 };
  });

  records.forEach(r => {
    const month = months[new Date(r.date).getMonth()];
    if (r.type === 'income') trendsMap[month].income += r.amount;
    else trendsMap[month].expense += r.amount;
  });

  return sendSuccess(res, Object.values(trendsMap).map(t => ({
    month: t.name,
    income: t.income,
    expense: t.expense
  })));
};

export const getRecentActivity = async (req: Request, res: Response) => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { createdBy: { select: { name: true } } }
  });

  const activity = records.map(r => ({
    id: r.id,
    type: r.type,
    amount: r.amount,
    category: r.category,
    description: r.description,
    user: r.createdBy.name,
    date: r.date
  }));

  return sendSuccess(res, activity);
};
