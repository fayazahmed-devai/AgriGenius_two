import { Router } from 'express';
import { recommendIrrigation, getIrrigationAdvisories, getIrrigationAdvisoryById } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { irrigationAdvisorySchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/recommend', validate(irrigationAdvisorySchema), recommendIrrigation);
router.get('/advisories', getIrrigationAdvisories);
router.get('/advisories/:id', getIrrigationAdvisoryById);

export default router;

