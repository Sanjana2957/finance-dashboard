import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, updateRole, toggleStatus } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole(['admin', 'analyst']), asyncHandler(getAllUsers));
router.get('/:id', requireRole(['admin']), asyncHandler(getUserById));
router.post('/', requireRole(['admin']), asyncHandler(createUser));
router.put('/:id', requireRole(['admin']), asyncHandler(updateUser));
router.patch('/:id/role', requireRole(['admin']), asyncHandler(updateRole));
router.patch('/:id/status', requireRole(['admin']), asyncHandler(toggleStatus));

export default router;
