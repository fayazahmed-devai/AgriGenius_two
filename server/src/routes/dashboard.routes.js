import { Router } from 'express';
import { getDashboardSummary, getRecentActivities, getUpcomingTasks } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', getDashboardSummary);
router.get('/recent-activities', getRecentActivities);
router.get('/upcoming-tasks', getUpcomingTasks);

export default router;

