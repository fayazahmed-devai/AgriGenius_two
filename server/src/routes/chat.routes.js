import { Router } from 'express';
import {
  sendChatMessage,
  getConversations,
  getConversationMessages,
  deleteConversation,
} from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatMessageSchema } from '../schemas/agronomy.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/conversations', getConversations);
router.post('/conversations', validate(chatMessageSchema), sendChatMessage);
router.get('/conversations/:id', getConversationMessages);
router.post('/conversations/:id/messages', validate(chatMessageSchema), sendChatMessage);
router.delete('/conversations/:id', deleteConversation);

export default router;

