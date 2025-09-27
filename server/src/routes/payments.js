import express from 'express';
import { 
  createPayment,
  getPayment,
  getUserPayments,
  getHostPayments,
  refundPayment,
  getPaymentStats
} from '../controllers/paymentController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(userMiddleware);

// Create payment (after booking approval)
router.post('/', createPayment);

// Get single payment details
router.get('/:id', getPayment);

// Get user's payments
router.get('/user/my-payments', getUserPayments);

// Get host's received payments
router.get('/host/received', getHostPayments);

// Get payment statistics for host
router.get('/host/stats', getPaymentStats);

// Refund payment
router.patch('/:id/refund', refundPayment);

export default router;