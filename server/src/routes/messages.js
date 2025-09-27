import express from 'express';
import { 
  getBookingMessages,
  sendMessage,
  getUserConversations,
  markMessagesAsRead
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations for the current user
router.get('/conversations', getUserConversations);

// Get messages for a specific booking
router.get('/booking/:bookingId', getBookingMessages);

// Send a message in a booking conversation
router.post('/booking/:bookingId', sendMessage);

// Mark messages as read in a booking conversation
router.put('/booking/:bookingId/read', markMessagesAsRead);

export default router;