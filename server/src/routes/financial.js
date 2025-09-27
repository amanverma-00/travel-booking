import express from 'express';
import { 
  getEarningsDashboard,
  getEarningsHistory,
  requestPayout,
  getPayoutHistory
} from '../controllers/financialController.js';
import { protect, hostRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and host privileges
router.use(protect, hostRequired);

// Earnings routes
router.get('/earnings/dashboard', getEarningsDashboard);
router.get('/earnings/history', getEarningsHistory);

// Dashboard route (for backwards compatibility)
router.get('/dashboard', getEarningsDashboard);

// Payout routes
router.post('/payouts/request', requestPayout);
router.get('/payouts/history', getPayoutHistory);
router.post('/request-payout', requestPayout);
router.get('/payouts', getPayoutHistory);

export default router;