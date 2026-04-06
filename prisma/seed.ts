import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.financialRecord.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial enterprise users...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      id: 'u1',
      name: 'Sarah Executive',
      email: 'admin@gmail.com',
      role: 'admin',
      password: 'password123',
      isActive: true
    }
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@gmail.com' },
    update: {},
    create: {
      id: 'u2',
      name: 'James Analyst',
      email: 'analyst@gmail.com',
      role: 'analyst',
      password: 'password123',
      isActive: true
    }
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@gmail.com' },
    update: {},
    create: {
      id: 'u3',
      name: 'Michael Viewer',
      email: 'viewer@gmail.com',
      role: 'viewer',
      password: 'password123',
      isActive: true
    }
  });

  console.log('Seeding financial records for the entire year...');
  
  const months = Array.from({ length: 12 }, (_, i) => i);
  const categories = {
    income: ['Project Revenue', 'Advisory Retainer', 'Product Sales', 'Stock Dividends'],
    expense: ['AWS Bill', 'Office Supplies', 'Marketing', 'Employee Salaries', 'Cloud Infrastructure', 'Travel Expenses']
  };

  for (const month of months) {
    const recordCount = Math.floor(Math.random() * 6) + 5; // 5 to 10 records
    for (let i = 0; i < recordCount; i++) {
      const type = Math.random() > 0.4 ? 'income' : 'expense';
      const category = type === 'income' 
        ? categories.income[Math.floor(Math.random() * categories.income.length)]
        : categories.expense[Math.floor(Math.random() * categories.expense.length)];
      
      await prisma.financialRecord.create({
        data: {
          amount: type === 'income' 
            ? Math.floor(Math.random() * 4000) + 2000
            : Math.floor(Math.random() * 1500) + 500,
          type,
          category,
          description: `${category} transaction for ${new Date(2024, month).toLocaleString('default', { month: 'long' })}`,
          date: new Date(2024, month, Math.floor(Math.random() * 28) + 1),
          createdById: i % 2 === 0 ? 'u1' : 'u2'
        }
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
