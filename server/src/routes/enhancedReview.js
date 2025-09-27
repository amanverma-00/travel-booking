import express from 'express';
import {
  createReview,
  getListingReviews,
  getUserReviews,
  toggleHelpfulVote,
  addReviewResponse
} from '../controllers/enhancedReviewController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(userMiddleware);

// Submit a review for a booking
router.post('/:bookingId', createReview);

// Get all reviews for a listing
router.get('/:listingId/reviews', getListingReviews);

// Get current user's reviews
router.get('/user/:userId', getUserReviews);

// Vote on review helpfulness
router.post('/:reviewId/vote', toggleHelpfulVote);

// Respond to a review (host only)
router.post('/:reviewId/response', addReviewResponse);

export default router;