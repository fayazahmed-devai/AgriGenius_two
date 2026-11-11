import { Router } from 'express';
import { recommendFertilizer, getFertilizerAdvisories, getFertilizerAdvisoryById } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { fertilizerAdvisorySchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/recommend', validate(fertilizerAdvisorySchema), recommendFertilizer);
router.get('/advisories', getFertilizerAdvisories);
router.get('/advisories/:id', getFertilizerAdvisoryById);

export default router;

