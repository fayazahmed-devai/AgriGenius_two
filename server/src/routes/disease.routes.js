import { Router } from 'express';
import { analyzeDisease, getDiseaseReports, getDiseaseReportById } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadCropImage } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { diseaseDetectionSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post(
  '/analyze',
  uploadCropImage.single('image'),
  validate(diseaseDetectionSchema),
  analyzeDisease
);
router.get('/reports', getDiseaseReports);
router.get('/reports/:id', getDiseaseReportById);

export default router;

