import express from 'express';
import { chatWithListingAI } from '../controllers/aiChatController.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', chatWithListingAI);

export default router;
