import { Router } from 'express';
import { analyzeSoil, getSoilReports, getSoilReportById, deleteSoilReport } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { soilAnalysisSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/analyze', validate(soilAnalysisSchema), analyzeSoil);
router.get('/reports', getSoilReports);
router.get('/reports/:id', getSoilReportById);
router.delete('/reports/:id', deleteSoilReport);

export default router;

