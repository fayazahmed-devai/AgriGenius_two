import { Router } from 'express';
import {
  generateCalendar,
  getCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
} from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { cultivationCalendarSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/generate', validate(cultivationCalendarSchema), generateCalendar);
router.get('/', getCalendars);
router.get('/:id', getCalendarById);
router.put('/:id', updateCalendar);
router.delete('/:id', deleteCalendar);

export default router;

