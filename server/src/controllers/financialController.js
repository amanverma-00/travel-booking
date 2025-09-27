import Earnings from "../models/earnings.js";
import Payout from "../models/payout.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";

// Get host earnings dashboard
export const getEarningsDashboard = async (req, res) => {
  try {
    const hostId = req.user._id;

    // Get current month earnings
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Aggregate earnings data
    const [
      availableEarnings,
      monthlyEarnings,
      yearlyEarnings,
      recentPayouts,
      pendingEarnings
    ] = await Promise.all([
      // Available earnings
      Earnings.getAvailableEarnings(hostId),
      
      // Current month earnings
      Earnings.aggregate([
        {
          $match: {
            host: hostId,
            createdAt: { $gte: currentMonthStart, $lt: nextMonthStart }
          }
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$hostEarnings' },
            totalBookings: { $sum: 1 },
            averageBookingValue: { $avg: '$grossAmount' }
          }
        }
      ]),

      // Yearly earnings by month
      Earnings.getEarningsByPeriod(
        hostId,
        new Date(currentDate.getFullYear(), 0, 1),
        new Date(currentDate.getFullYear(), 11, 31)
      ),

      // Recent payouts
      Payout.find({ host: hostId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('bookings', 'startDate endDate listing')
        .populate({
          path: 'bookings',
          populate: { path: 'listing', select: 'title' }
        }),

      // Pending earnings (not yet available)
      Earnings.find({
        host: hostId,
        status: 'pending',
        availableAt: { $gt: new Date() }
      })
      .populate('booking', 'startDate endDate')
      .sort({ availableAt: 1 })
    ]);

    // Calculate totals
    const availableTotal = availableEarnings[0] || { totalEarnings: 0, count: 0 };
    const monthlyTotal = monthlyEarnings[0] || { totalEarnings: 0, totalBookings: 0, averageBookingValue: 0 };
    const pendingTotal = pendingEarnings.reduce((sum, earning) => sum + earning.hostEarnings, 0);

    // Get lifetime stats
    const lifetimeStats = await Earnings.aggregate([
      { $match: { host: hostId } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$hostEarnings' },
          totalGross: { $sum: '$grossAmount' },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: '$grossAmount' }
        }
      }
    ]);

    const lifetime = lifetimeStats[0] || {
      totalEarnings: 0,
      totalGross: 0,
      totalBookings: 0,
      averageBookingValue: 0
    };

    res.status(200).json({
      success: true,
      data: {
        summary: {
          availableEarnings: availableTotal.totalEarnings || 0,
          availableBookings: availableTotal.count || 0,
          pendingEarnings: pendingTotal,
          pendingBookings: pendingEarnings.length,
          monthlyEarnings: monthlyTotal.totalEarnings || 0,
          monthlyBookings: monthlyTotal.totalBookings || 0,
          averageBookingValue: monthlyTotal.averageBookingValue || 0,
          lifetimeEarnings: lifetime.totalEarnings || 0,
          lifetimeBookings: lifetime.totalBookings || 0
        },
        charts: {
          monthlyEarnings: yearlyEarnings,
          availableVsPending: {
            available: availableTotal.totalEarnings || 0,
            pending: pendingTotal
          }
        },
        recentPayouts,
        upcomingEarnings: pendingEarnings.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get detailed earnings history
export const getEarningsHistory = async (req, res) => {
  try {
    const hostId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = { host: hostId };
    if (status && ['pending', 'available', 'paid_out', 'on_hold'].includes(status)) {
      query.status = status;
    }

    const [earnings, totalCount] = await Promise.all([
      Earnings.find(query)
        .populate('booking', 'startDate endDate user guests')
        .populate('listing', 'title location')
        .populate({
          path: 'booking',
          populate: { path: 'user', select: 'firstName lastName' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      Earnings.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        earnings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalEarnings: totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
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

// Request payout
export const requestPayout = async (req, res) => {
  try {
    const hostId = req.user._id;
    const { payoutMethod, payoutDetails, amount } = req.body;

    // Validate payout method
    if (!['bank_transfer', 'upi', 'wallet'].includes(payoutMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payout method'
      });
    }

    // Get available earnings
    const availableEarnings = await Earnings.find({
      host: hostId,
      status: 'available',
      availableAt: { $lte: new Date() }
    }).populate('booking');

    if (availableEarnings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No available earnings to payout'
      });
    }

    const totalAvailable = availableEarnings.reduce((sum, earning) => sum + earning.hostEarnings, 0);
    const requestedAmount = amount || totalAvailable;

    if (requestedAmount > totalAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Requested amount exceeds available earnings'
      });
    }

    if (requestedAmount < 100) { // Minimum payout amount
      return res.status(400).json({
        success: false,
        error: 'Minimum payout amount is ₹100'
      });
    }

    // Calculate platform fee (3% for payouts)
    const platformFee = Math.round(requestedAmount * 0.03);
    const hostEarnings = requestedAmount - platformFee;

    // Select earnings to include in payout
    let runningTotal = 0;
    const earningsToInclude = [];
    const bookingsToInclude = [];

    for (const earning of availableEarnings) {
      if (runningTotal + earning.hostEarnings <= requestedAmount) {
        earningsToInclude.push(earning);
        bookingsToInclude.push(earning.booking._id);
        runningTotal += earning.hostEarnings;
        
        if (runningTotal >= requestedAmount) break;
      }
    }

    // Create payout
    const payout = await Payout.create({
      host: hostId,
      bookings: bookingsToInclude,
      hostEarnings,
      platformFee,
      payoutMethod,
      payoutDetails,
      metadata: {
        period: {
          startDate: earningsToInclude[earningsToInclude.length - 1]?.createdAt,
          endDate: earningsToInclude[0]?.createdAt
        },
        bookingCount: bookingsToInclude.length,
        averageBookingValue: runningTotal / bookingsToInclude.length
      }
    });

    // Update earnings status
    await Promise.all(
      earningsToInclude.map(earning => 
        earning.markAsPaidOut(payout._id)
      )
    );

    // Create notification
    await Notification.create({
      recipient: hostId,
      type: 'payout_processed',
      title: 'Payout Request Submitted',
      message: `Your payout request of ₹${hostEarnings} has been submitted for processing`,
      data: {
        payout: payout._id,
        amount: hostEarnings
      },
      priority: 'normal',
      channels: { inApp: true, email: true }
    });

    await payout.populate([
      { path: 'bookings', populate: { path: 'listing', select: 'title' } },
      { path: 'host', select: 'firstName lastName emailId' }
    ]);

    res.status(201).json({
      success: true,
      data: payout,
      message: 'Payout request submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get payout history
export const getPayoutHistory = async (req, res) => {
  try {
    const hostId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = { host: hostId };
    if (status && ['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const [payouts, totalCount] = await Promise.all([
      Payout.find(query)
        .populate('bookings', 'startDate endDate listing user')
        .populate({
          path: 'bookings',
          populate: [
            { path: 'listing', select: 'title' },
            { path: 'user', select: 'firstName lastName' }
          ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      Payout.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        payouts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalPayouts: totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
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

// Process earnings for completed bookings (Admin function)
export const processBookingEarnings = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('listing')
      .populate('host');

    if (!booking || booking.status !== 'completed') {
      throw new Error('Booking not found or not completed');
    }

    // Check if earnings already exist
    const existingEarnings = await Earnings.findOne({ booking: bookingId });
    if (existingEarnings) {
      return existingEarnings;
    }

    // Calculate earnings
    const grossAmount = booking.totalAmount;
    const platformFee = booking.serviceFee;
    const paymentProcessingFee = Math.round(grossAmount * 0.02); // 2% payment processing
    const hostEarnings = grossAmount - platformFee - paymentProcessingFee;

    const earnings = await Earnings.create({
      host: booking.host._id,
      booking: bookingId,
      listing: booking.listing._id,
      grossAmount,
      hostEarnings,
      platformFee,
      paymentProcessingFee,
      metadata: {
        bookingDates: {
          checkIn: booking.startDate,
          checkOut: booking.endDate
        },
        guests: booking.guests,
        nights: Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24)),
        pricePerNight: booking.basePrice / Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24))
      }
    });

    // Create notification for host
    await Notification.createPaymentNotification(booking.host._id, hostEarnings);

    return earnings;
  } catch (error) {
    console.error('Error processing booking earnings:', error);
    throw error;
  }
};