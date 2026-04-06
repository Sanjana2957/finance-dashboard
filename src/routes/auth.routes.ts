import { Router, Request, Response } from 'express';
import { getMe, login } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/login', asyncHandler(login));

router.use(requireAuth);
router.get('/me', getMe);

export default router;
