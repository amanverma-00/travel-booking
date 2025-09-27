import express from 'express';
import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing
} from '../controllers/listingController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';
import { trackListingView, trackSearch } from '../middleware/analyticsMiddleware.js';
import Listing from '../models/listing.js';

const router = express.Router();

// Public routes
router.get('/', trackSearch, getListings);
router.get('/:id', trackListingView, getListing);

// Protected routes
router.post('/create', userMiddleware, createListing);
router.put('/:id', userMiddleware, updateListing);
router.delete('/:id', userMiddleware, deleteListing);

// Host-specific routes
router.get('/host/my-listings', userMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id })
      .select('title images pricing location averageRating capacity description')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings'
    });
  }
});

export default router;