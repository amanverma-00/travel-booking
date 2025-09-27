import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getMyBookings,
  getHostBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
  getAvailableDates
} from '../controllers/bookingController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/available-dates/:listingId', getAvailableDates);

// Protected routes - Guest bookings
router.post('/', userMiddleware, createBooking);
router.get('/my-bookings', userMiddleware, getMyBookings);
router.get('/user-bookings', userMiddleware, getUserBookings);
router.get('/available-dates/:listingId', getAvailableDates); // No auth needed for checking availability
router.get('/:id', userMiddleware, getBooking);
router.patch('/:id/cancel', userMiddleware, cancelBooking);

// Protected routes - Host bookings
router.get('/host/all', userMiddleware, getHostBookings);
router.get('/host/pending', userMiddleware, getPendingBookings);
router.patch('/:id/approve', userMiddleware, approveBooking);
router.patch('/:id/reject', userMiddleware, rejectBooking);
router.patch('/:id/complete', userMiddleware, completeBooking);

export default router;