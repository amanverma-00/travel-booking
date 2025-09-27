import Calendar from "../models/calendar.js";
import Listing from "../models/listing.js";
import Booking from "../models/booking.js";

// Get calendar availability for a listing
export const getCalendar = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Get calendar entries for the date range
    const calendarEntries = await Calendar.find({
      listing: listingId,
      date: { $gte: start, $lte: end }
    })
    .populate('booking', 'user startDate endDate guests')
    .sort({ date: 1 });

    // Fill in missing dates with default availability
    const dateRange = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingEntry = calendarEntries.find(
        entry => entry.date.toISOString().split('T')[0] === dateStr
      );
      
      if (existingEntry) {
        dateRange.push(existingEntry);
      } else {
        // Default available date with listing base price
        dateRange.push({
          date: new Date(currentDate),
          status: 'available',
          price: listing.pricing.basePrice,
          listing: listingId
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.status(200).json({
      success: true,
      data: dateRange
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Block dates (Host only)
export const blockDates = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate, reason } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is the host of this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the host can block dates'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for existing bookings in this date range
    const conflictingBookings = await Booking.find({
      listing: listingId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        { startDate: { $lte: start }, endDate: { $gt: start } },
        { startDate: { $lt: end }, endDate: { $gte: end } },
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot block dates with existing confirmed bookings'
      });
    }

    // Block all dates in the range
    const datesToBlock = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      datesToBlock.push({
        listing: listingId,
        date: new Date(currentDate),
        status: 'blocked',
        blockReason: reason || 'Blocked by host'
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Use upsert to handle existing calendar entries
    const blockPromises = datesToBlock.map(dateEntry =>
      Calendar.findOneAndUpdate(
        { listing: listingId, date: dateEntry.date },
        dateEntry,
        { upsert: true, new: true }
      )
    );

    await Promise.all(blockPromises);

    res.status(200).json({
      success: true,
      message: `Blocked ${datesToBlock.length} dates successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Unblock dates (Host only)
export const unblockDates = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is the host of this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the host can unblock dates'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Remove blocked dates or set them back to available
    await Calendar.deleteMany({
      listing: listingId,
      date: { $gte: start, $lte: end },
      status: 'blocked'
    });

    res.status(200).json({
      success: true,
      message: 'Dates unblocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update pricing for specific dates (Host only)
export const updatePricing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { dates } = req.body; // Array of { date, price }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is the host of this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the host can update pricing'
      });
    }

    // Update pricing for each date
    const updatePromises = dates.map(({ date, price }) =>
      Calendar.findOneAndUpdate(
        { listing: listingId, date: new Date(date) },
        { 
          listing: listingId,
          date: new Date(date),
          price: price,
          status: 'available'
        },
        { upsert: true, new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `Updated pricing for ${dates.length} dates`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};