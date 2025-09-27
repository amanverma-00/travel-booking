import express from 'express';
import { userMiddleware, hostRequired } from '../middleware/authMiddleware.js';
import {
  getAdvancedAnalytics,
  getPricingRecommendations,
  applyPricingRecommendation,
  getPersonalizedRecommendations,
  trackRecommendationInteraction,
  getMarketIntelligence
} from '../controllers/aiAnalyticsController.js';
import {
  updateListingAnalytics,
  getPerformanceDashboard,
  getListingAnalytics,
  getGuestBehaviorAnalytics
} from '../controllers/performanceController.js';

const router = express.Router();

// AI Analytics Routes
router.get('/advanced/:listingId', 
  userMiddleware, 
  hostRequired, 
  getAdvancedAnalytics
);

router.get('/pricing-recommendations/:listingId', 
  userMiddleware, 
  hostRequired, 
  getPricingRecommendations
);

router.post('/apply-pricing/:listingId', 
  userMiddleware, 
  hostRequired, 
  applyPricingRecommendation
);

router.get('/recommendations/:userId', 
  userMiddleware, 
  getPersonalizedRecommendations
);

router.post('/track-interaction', 
  userMiddleware, 
  trackRecommendationInteraction
);

router.get('/market-intelligence', 
  userMiddleware, 
  hostRequired, 
  getMarketIntelligence
);

// Performance Analytics Routes
router.post('/update/:listingId', 
  userMiddleware, 
  hostRequired, 
  updateListingAnalytics
);

router.get('/dashboard', 
  userMiddleware, 
  hostRequired, 
  getPerformanceDashboard
);

router.get('/listing/:listingId', 
  userMiddleware, 
  hostRequired, 
  getListingAnalytics
);

router.get('/guest-behavior', 
  userMiddleware, 
  hostRequired, 
  getGuestBehaviorAnalytics
);

export default router;