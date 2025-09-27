import express from 'express';
import {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
  getMyReviews
} from '../controllers/reviewController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/listing/:listingId', getListingReviews);

// Protected routes
router.post('/', userMiddleware, createReview);
router.get('/my-reviews', userMiddleware, getMyReviews);
router.put('/:id', userMiddleware, updateReview);
router.delete('/:id', userMiddleware, deleteReview);

export default router;