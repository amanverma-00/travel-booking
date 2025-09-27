import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/notificationController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(userMiddleware);

// Get user notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Get notification preferences
router.get('/preferences', getNotificationPreferences);

// Update notification preferences
router.post('/preferences', updateNotificationPreferences);

export default router;