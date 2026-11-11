import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import soilRoutes from './soil.routes.js';
import fertilizerRoutes from './fertilizer.routes.js';
import irrigationRoutes from './irrigation.routes.js';
import diseaseRoutes from './disease.routes.js';
import calendarRoutes from './calendar.routes.js';
import chatRoutes from './chat.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgroAI Agricultural Intelligence API is active and operational.',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    error: null,
  });
});

// Mount domain routes
router.use('/profile', profileRoutes);
router.use('/farms', farmRoutes);
router.use('/crop', cropRoutes);
router.use('/soil', soilRoutes);
router.use('/fertilizer', fertilizerRoutes);
router.use('/irrigation', irrigationRoutes);
router.use('/disease', diseaseRoutes);
router.use('/calendar', calendarRoutes);
router.use('/chat', chatRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

