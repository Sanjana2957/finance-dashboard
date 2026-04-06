import { Router } from 'express';
import { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/records.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole(['viewer', 'analyst', 'admin']), asyncHandler(getAllRecords));
router.get('/:id', requireRole(['viewer', 'analyst', 'admin']), asyncHandler(getRecordById));
router.post('/', requireRole(['admin']), asyncHandler(createRecord));
router.patch('/:id', requireRole(['admin']), asyncHandler(updateRecord));
router.put('/:id', requireRole(['admin']), asyncHandler(updateRecord));
router.delete('/:id', requireRole(['admin']), asyncHandler(deleteRecord));

export default router;
