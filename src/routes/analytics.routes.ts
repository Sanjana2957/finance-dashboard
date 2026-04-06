import { Router } from 'express';
import { getSummary, getCategories, getTrends, getRecentActivity } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/summary', requireRole(['admin', 'analyst', 'viewer']), asyncHandler(getSummary));
router.get('/categories', requireRole(['admin', 'analyst', 'viewer']), asyncHandler(getCategories));
router.get('/trends', requireRole(['admin', 'analyst', 'viewer']), asyncHandler(getTrends));
router.get('/recent-activity', requireRole(['admin', 'analyst', 'viewer']), asyncHandler(getRecentActivity));

export default router;
