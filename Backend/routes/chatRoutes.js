import express from 'express';

import { sendMessage, getConversation } from '../controllers/conversationController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/:receiverId', protect, sendMessage);
router.get('/:receiverId', protect, getConversation);

export default router;

