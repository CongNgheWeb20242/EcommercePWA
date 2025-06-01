import express from 'express';
import { getAllConversations, getChatHistory } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', getAllConversations);
router.get('/:conversationId', getChatHistory);

export default router;