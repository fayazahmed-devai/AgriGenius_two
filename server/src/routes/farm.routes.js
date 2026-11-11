import { Router } from 'express';
import { getFarms, createFarm, getFarmById, updateFarm, deleteFarm } from '../controllers/farm.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { farmSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFarms);
router.post('/', validate(farmSchema), createFarm);
router.get('/:id', getFarmById);
router.put('/:id', validate(farmSchema), updateFarm);
router.delete('/:id', deleteFarm);

export default router;

