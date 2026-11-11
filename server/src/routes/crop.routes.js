import { Router } from 'express';
import { recommendCrop, getCropRecommendations, getCropRecommendationById, deleteCropRecommendation } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { cropRecommendationSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/recommend', validate(cropRecommendationSchema), recommendCrop);
router.get('/recommendations', getCropRecommendations);
router.get('/recommendations/:id', getCropRecommendationById);
router.delete('/recommendations/:id', deleteCropRecommendation);

export default router;

