import prisma from '../prisma/client';

export const logAudit = async (
  action: string,
  entityType: string,
  entityId: string,
  performedById: string,
  details: string
) => {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        performedById,
        details
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
