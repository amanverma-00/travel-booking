import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import Calendar from "../models/calendar.js";
import { sendSystemMessage } from "./messageController.js";
import { processBookingEarnings } from "./financialController.js";
import Notification from "../models/notification.js";

export const createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate, guests, specialRequests } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    const listing = await Listing.findById(listingId).populate('host');
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    if (!listing.isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Listing is not available'
      });
    }

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      listing: listingId,
      status: { $in: ['confirmed', 'active', 'approved'] },
      $or: [
        { startDate: { $lte: start }, endDate: { $gt: start } },
        { startDate: { $lt: end }, endDate: { $gte: end } },
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Selected dates are not available'
      });
    }

    // Check calendar for blocked dates
    const blockedDates = await Calendar.find({
      listing: listingId,
      date: { $gte: start, $lt: end },
      status: 'blocked'
    });

    if (blockedDates.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Some dates in the selected range are blocked'
      });
    }

    // Calculate total price
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const basePrice = days * listing.pricing.basePrice;
    const cleaningFee = listing.pricing.cleaningFee || 0;
    const serviceFee = Math.round(basePrice * 0.14); // 14% service fee
    const totalPrice = basePrice + cleaningFee + serviceFee;

    // Create booking with pending status
    const booking = await Booking.create({
      listing: listingId,
      user: req.user._id,
      startDate: start,
      endDate: end,
      totalPrice,
      basePrice,
      cleaningFee,
      serviceFee,
      guests,
      specialRequests,
      status: 'pending' // Requires host approval
    });

    // Populate related data
    await booking.populate([
      { 
        path: 'listing', 
        select: 'title price location description images host',
        populate: { path: 'host', select: 'firstName lastName emailId hostProfile' }
      },
      { path: 'user', select: 'firstName lastName emailId profileImage' }
    ]);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking request sent to host for approval'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate([
        { path: 'listing', select: 'title price location images' },
        { path: 'payment', select: 'status amount' }
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate([
        { path: 'listing', select: 'title price location description images host' },
        { path: 'user', select: 'firstName emailId' },
        { path: 'payment', select: 'status amount currency receiptUrl' }
      ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.user.toString() !== req.user._id.toString() && 
        booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get available dates for a listing
export const getAvailableDates = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all booked/blocked dates from calendar
    const unavailableDates = await Calendar.find({
      listing: listingId,
      date: { $gte: start, $lt: end },
      status: { $in: ['booked', 'blocked'] }
    }).select('date status booking');

    // Get confirmed bookings for this period as backup check
    const confirmedBookings = await Booking.find({
      listing: listingId,
      status: { $in: ['confirmed', 'active', 'approved'] },
      $or: [
        { startDate: { $lte: start }, endDate: { $gt: start } },
        { startDate: { $lt: end }, endDate: { $gte: end } },
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    }).select('startDate endDate status');

    res.status(200).json({
      success: true,
      data: {
        unavailableDates,
        confirmedBookings,
        listing: {
          id: listing._id,
          title: listing.title,
          isAvailable: listing.isAvailable
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel booking with status: ${booking.status}`
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Free up the calendar dates by removing booked entries
    // This will make the dates available again for other bookings
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    
    await Calendar.deleteMany({
      listing: booking.listing,
      booking: booking._id,
      status: 'booked',
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    console.log(`Freed calendar dates for cancelled booking: ${booking._id}`);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and dates have been freed for new bookings'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'listing',
        select: 'title location images price'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// NEW HOST-SPECIFIC FUNCTIONS

// Get all bookings for host's properties
export const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user._id;
    
    // Get all listings owned by this host
    const hostListings = await Listing.find({ host: hostId }).select('_id');
    const listingIds = hostListings.map(listing => listing._id);
    
    // Get bookings for these listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate([
        { 
          path: 'listing', 
          select: 'title location images pricing.basePrice' 
        },
        { 
          path: 'user', 
          select: 'firstName lastName emailId profileImage' 
        }
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get pending bookings for host approval
export const getPendingBookings = async (req, res) => {
  try {
    const hostId = req.user._id;
    
    // Get all listings owned by this host
    const hostListings = await Listing.find({ host: hostId }).select('_id');
    const listingIds = hostListings.map(listing => listing._id);
    
    // Get pending bookings for these listings
    const pendingBookings = await Booking.find({ 
      listing: { $in: listingIds },
      status: 'pending'
    })
    .populate([
      { 
        path: 'listing', 
        select: 'title location images pricing.basePrice' 
      },
      { 
        path: 'user', 
        select: 'firstName lastName emailId profileImage' 
      }
    ])
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Host approves a booking
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    const booking = await Booking.findById(id).populate('listing');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Check if the current user is the host of this listing
    if (booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to approve this booking'
      });
    }
    
    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending bookings can be approved'
      });
    }
    
    // Update booking status to approved (not confirmed yet - waiting for payment)
    booking.status = 'approved';
    booking.hostMessage = message;
    booking.approvedAt = new Date();
    await booking.save();

    // Create payment record for approved booking
    const payment = new Payment({
      booking: booking._id,
      user: booking.user,
      amount: booking.totalPrice,
      currency: 'USD',
      paymentMethod: 'credit_card', // Default method
      paymentIntentId: `pi_${Date.now()}_${booking._id}`, // Mock payment intent ID
      status: 'completed' // In real implementation, this would be processed via Stripe
    });

    await payment.save();

    // Update booking with payment reference and confirm it
    booking.payment = payment._id;
    booking.status = 'confirmed'; // Move to confirmed status after payment
    booking.confirmedAt = new Date();
    await booking.save();

    // Block calendar dates for approved booking
    const bookingDates = [];
    const currentDate = new Date(booking.startDate);
    while (currentDate < booking.endDate) {
      bookingDates.push({
        listing: booking.listing._id,
        date: new Date(currentDate),
        status: 'booked',
        booking: booking._id
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Use upsert to handle existing calendar entries
    const calendarPromises = bookingDates.map(dateEntry =>
      Calendar.findOneAndUpdate(
        { listing: booking.listing._id, date: dateEntry.date },
        dateEntry,
        { upsert: true, new: true }
      )
    );

    await Promise.all(calendarPromises);

    // Create notification for host about payment received
    await Notification.createPaymentNotification(
      booking.listing.host,
      booking.totalPrice,
      'payment_received'
    );

    // Send system message
    try {
      await sendSystemMessage(
        booking._id, 
        'booking_approved', 
        message || 'Your booking has been approved and payment has been processed!'
      );
    } catch (msgError) {
      console.error('Error sending system message:', msgError);
    }
    
    // Populate for response
    await booking.populate([
      { 
        path: 'listing', 
        select: 'title location images' 
      },
      { 
        path: 'user', 
        select: 'firstName lastName emailId' 
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Host rejects a booking
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const booking = await Booking.findById(id).populate('listing');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Check if the current user is the host of this listing
    if (booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to reject this booking'
      });
    }
    
    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending bookings can be rejected'
      });
    }
    
    // Update booking status
    booking.status = 'rejected';
    booking.rejectionReason = reason;
    booking.rejectedAt = new Date();
    await booking.save();

    // Send system message
    try {
      await sendSystemMessage(
        booking._id, 
        'booking_rejected', 
        reason || 'Your booking request has been declined by the host.'
      );
    } catch (msgError) {
      console.error('Error sending system message:', msgError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Complete a booking (usually called after checkout)
export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('listing')
      .populate('guestId', 'name email');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Check if the current user is the host or admin
    const isHost = booking.listing.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isHost && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to complete this booking'
      });
    }
    
    // Check if booking is in confirmed status and end date has passed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Only confirmed bookings can be completed'
      });
    }

    const now = new Date();
    if (booking.endDate > now) {
      return res.status(400).json({
        success: false,
        error: 'Booking can only be completed after the end date'
      });
    }
    
    // Update booking status
    booking.status = 'completed';
    booking.completedAt = now;
    await booking.save();

    // Process earnings for host
    await processBookingEarnings(booking._id);

    // Send notification to both parties
    await Notification.create({
      userId: booking.guestId._id,
      type: 'booking_completed',
      title: 'Booking Completed',
      message: `Your stay at ${booking.listing.title} has been completed. Please leave a review!`,
      relatedId: booking._id,
      relatedModel: 'Booking'
    });

    await Notification.create({
      userId: booking.listing.host,
      type: 'booking_completed',
      title: 'Guest Stay Completed',
      message: `${booking.guestId.name}'s stay at your property has ended. Your earnings are being processed.`,
      relatedId: booking._id,
      relatedModel: 'Booking'
    });

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};