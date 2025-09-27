import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import Notification from "../models/notification.js";

// Create a payment after booking approval
export const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentIntentId } = req.body;
    
    // Find the booking
    const booking = await Booking.findById(bookingId).populate('listing user');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        error: 'Payment already exists for this booking'
      });
    }

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: booking.user._id,
      amount: booking.totalPrice,
      currency: 'USD',
      paymentMethod: paymentMethod || 'credit_card',
      paymentIntentId: paymentIntentId || `pi_${Date.now()}`, // Mock payment intent ID
      status: 'completed' // In real implementation, this would be 'pending' until Stripe confirms
    });

    await payment.save();

    // Update booking with payment reference
    booking.payment = payment._id;
    booking.status = 'confirmed'; // Move to confirmed status after payment
    booking.confirmedAt = new Date();
    await booking.save();

    // Create notification for host about payment received
    await Notification.createPaymentNotification(
      booking.listing.host,
      booking.totalPrice
    );

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get payment details
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id)
      .populate({
        path: 'booking',
        populate: {
          path: 'listing',
          select: 'title location images'
        }
      })
      .populate('user', 'firstName lastName emailId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Check if user owns this payment or is the host
    const booking = await Booking.findById(payment.booking._id).populate('listing');
    const isOwner = payment.user._id.toString() === req.user._id.toString();
    const isHost = booking.listing.host.toString() === req.user._id.toString();
    
    if (!isOwner && !isHost) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's payments
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({
        path: 'booking',
        populate: {
          path: 'listing',
          select: 'title location images'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get host's received payments
export const getHostPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'booking',
        populate: {
          path: 'listing',
          match: { host: req.user._id },
          select: 'title location images host'
        }
      })
      .populate('user', 'firstName lastName emailId')
      .sort({ createdAt: -1 });

    // Filter out payments where listing is null (not host's properties)
    const hostPayments = payments.filter(payment => payment.booking.listing);

    res.status(200).json({
      success: true,
      data: hostPayments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Refund payment (for cancellations)
export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const payment = await Payment.findById(id).populate({
      path: 'booking',
      populate: { path: 'listing' }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Check if user owns this payment
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to refund this payment'
      });
    }

    // Check if payment can be refunded
    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        error: 'Payment already refunded'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Only completed payments can be refunded'
      });
    }

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.booking._id);
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment refunded successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get payment statistics for host dashboard
export const getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'booking',
        populate: {
          path: 'listing',
          match: { host: req.user._id },
          select: 'host'
        }
      });

    // Filter out payments for non-host listings
    const hostPayments = payments.filter(payment => payment.booking.listing);

    const stats = {
      totalEarnings: hostPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: hostPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: hostPayments.length,
      refundedAmount: hostPayments
        .filter(p => p.status === 'refunded')
        .reduce((sum, p) => sum + p.amount, 0)
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};