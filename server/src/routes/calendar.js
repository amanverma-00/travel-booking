import express from 'express';
import { 
  getCalendar, 
  blockDates, 
  unblockDates, 
  updatePricing 
} from '../controllers/calendarController.js';
import { protect, hostRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view calendar availability
router.get('/listings/:listingId', getCalendar);

// Host-only routes
router.use(protect, hostRequired);
router.post('/listings/:listingId/block', blockDates);
router.post('/listings/:listingId/unblock', unblockDates);
router.put('/listings/:listingId/pricing', updatePricing);

export default router;