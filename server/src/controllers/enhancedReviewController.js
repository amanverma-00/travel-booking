import Review from "../models/review.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import Listing from "../models/listing.js";
import Notification from "../models/notification.js";

// Create a review (guest reviewing host/property or host reviewing guest)
export const createReview = async (req, res) => {
  try {
    const { bookingId, reviewType, ratings, guestRatings, comment, privateFeedback, metadata } = req.body;
    const reviewerId = req.user._id;

    // Validate review type
    if (!['guest_to_host', 'host_to_guest'].includes(reviewType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid review type'
      });
    }

    // Get booking and verify permissions
    const booking = await Booking.findById(bookingId)
      .populate('listing')
      .populate('host')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify reviewer authorization
    if (reviewType === 'guest_to_host' && booking.user._id.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the guest can review the host'
      });
    }

    if (reviewType === 'host_to_guest' && booking.listing.host.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the host can review the guest'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only review completed bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
      reviewType,
      user: reviewerId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Review already submitted for this booking'
      });
    }

    // Prepare review data
    const reviewData = {
      listing: booking.listing._id,
      user: reviewerId,
      host: booking.listing.host,
      booking: bookingId,
      reviewType,
      comment,
      privateFeedback,
      metadata,
      isVerified: true // Since it's based on actual booking
    };

    // Add appropriate ratings
    if (reviewType === 'guest_to_host') {
      reviewData.ratings = ratings;
    } else {
      reviewData.guestRatings = guestRatings;
    }

    // Create review
    const review = await Review.create(reviewData);

    // Populate for response
    await review.populate([
      { path: 'user', select: 'firstName lastName profilePicture' },
      { path: 'host', select: 'firstName lastName profilePicture' },
      { path: 'listing', select: 'title images location' }
    ]);

    // Create notification for the reviewed party
    const recipientId = reviewType === 'guest_to_host' ? booking.listing.host : booking.user._id;
    const overallRating = reviewType === 'guest_to_host' ? ratings.overall : guestRatings.overall;
    
    await Notification.createReviewNotification(
      recipientId,
      reviewerId,
      reviewType,
      overallRating
    );

    // Update listing average rating if it's a guest review
    if (reviewType === 'guest_to_host') {
      await updateListingRating(booking.listing._id);
    }

    // Update host/user ratings
    if (reviewType === 'guest_to_host') {
      await updateHostRating(booking.listing.host);
    } else {
      await updateGuestRating(booking.user._id);
    }

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get reviews for a listing
export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, totalCount, averageRatings] = await Promise.all([
      Review.find({
        listing: listingId,
        reviewType: 'guest_to_host',
        status: 'published'
      })
      .populate('user', 'firstName lastName profilePicture')
      .populate('response.respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

      Review.countDocuments({
        listing: listingId,
        reviewType: 'guest_to_host',
        status: 'published'
      }),

      Review.aggregate([
        {
          $match: {
            listing: listingId,
            reviewType: 'guest_to_host',
            status: 'published'
          }
        },
        {
          $group: {
            _id: null,
            averageOverall: { $avg: '$ratings.overall' },
            averageCleanliness: { $avg: '$ratings.cleanliness' },
            averageAccuracy: { $avg: '$ratings.accuracy' },
            averageCommunication: { $avg: '$ratings.communication' },
            averageLocation: { $avg: '$ratings.location' },
            averageCheckIn: { $avg: '$ratings.checkIn' },
            averageValue: { $avg: '$ratings.value' },
            totalReviews: { $sum: 1 }
          }
        }
      ])
    ]);

    const ratings = averageRatings[0] || {
      averageOverall: 0,
      averageCleanliness: 0,
      averageAccuracy: 0,
      averageCommunication: 0,
      averageLocation: 0,
      averageCheckIn: 0,
      averageValue: 0,
      totalReviews: 0
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRatings: {
          overall: parseFloat(ratings.averageOverall?.toFixed(2)) || 0,
          cleanliness: parseFloat(ratings.averageCleanliness?.toFixed(2)) || 0,
          accuracy: parseFloat(ratings.averageAccuracy?.toFixed(2)) || 0,
          communication: parseFloat(ratings.averageCommunication?.toFixed(2)) || 0,
          location: parseFloat(ratings.averageLocation?.toFixed(2)) || 0,
          checkIn: parseFloat(ratings.averageCheckIn?.toFixed(2)) || 0,
          value: parseFloat(ratings.averageValue?.toFixed(2)) || 0,
          totalReviews: ratings.totalReviews
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalReviews: totalCount,
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

// Get host reviews (reviews about the host)
export const getHostReviews = async (req, res) => {
  try {
    const { hostId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      Review.find({
        host: hostId,
        reviewType: 'guest_to_host',
        status: 'published'
      })
      .populate('user', 'firstName lastName profilePicture')
      .populate('listing', 'title images location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

      Review.countDocuments({
        host: hostId,
        reviewType: 'guest_to_host',
        status: 'published'
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalReviews: totalCount,
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

// Get user's reviews (both given and received)
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = 'all' } = req.query; // 'given', 'received', 'all'

    let query = {};
    
    if (type === 'given') {
      query.user = userId;
    } else if (type === 'received') {
      query.$or = [
        { host: userId, reviewType: 'guest_to_host' },
        { user: { $ne: userId }, reviewType: 'host_to_guest', 'booking.user': userId }
      ];
    } else {
      // All reviews related to user
      query.$or = [
        { user: userId }, // Reviews given by user
        { host: userId, reviewType: 'guest_to_host' }, // Reviews received as host
      ];
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName profilePicture')
      .populate('host', 'firstName lastName profilePicture')
      .populate('listing', 'title images location')
      .populate('booking', 'startDate endDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add response to a review
export const addReviewResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;
    const responderId = req.user._id;

    const review = await Review.findById(reviewId)
      .populate('listing')
      .populate('host')
      .populate('user');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check authorization (only the reviewed party can respond)
    const canRespond = (
      (review.reviewType === 'guest_to_host' && review.host._id.toString() === responderId.toString()) ||
      (review.reviewType === 'host_to_guest' && review.user._id.toString() === responderId.toString())
    );

    if (!canRespond) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to respond to this review'
      });
    }

    if (review.response && review.response.content) {
      return res.status(400).json({
        success: false,
        error: 'Response already exists for this review'
      });
    }

    await review.addResponse(content, responderId);

    await review.populate('response.respondedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: review,
      message: 'Response added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Toggle helpful vote on a review
export const toggleHelpfulVote = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user already voted
    const hasVoted = review.helpful.voters.includes(userId);

    if (hasVoted) {
      await review.removeHelpfulVote(userId);
    } else {
      await review.addHelpfulVote(userId);
    }

    res.status(200).json({
      success: true,
      data: {
        helpfulCount: review.helpful.count,
        hasVoted: !hasVoted
      },
      message: hasVoted ? 'Vote removed' : 'Vote added'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper functions
const updateListingRating = async (listingId) => {
  try {
    const averageRating = await Review.aggregate([
      {
        $match: {
          listing: listingId,
          reviewType: 'guest_to_host',
          status: 'published'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.overall' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (averageRating.length > 0) {
      await Listing.findByIdAndUpdate(listingId, {
        'ratings.average': parseFloat(averageRating[0].averageRating.toFixed(2)),
        'ratings.count': averageRating[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating listing rating:', error);
  }
};

const updateHostRating = async (hostId) => {
  try {
    const averageRating = await Review.aggregate([
      {
        $match: {
          host: hostId,
          reviewType: 'guest_to_host',
          status: 'published'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.overall' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (averageRating.length > 0) {
      await User.findByIdAndUpdate(hostId, {
        'hostProfile.hostRating': parseFloat(averageRating[0].averageRating.toFixed(2)),
        'hostProfile.reviewCount': averageRating[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating host rating:', error);
  }
};

const updateGuestRating = async (guestId) => {
  try {
    const averageRating = await Review.aggregate([
      {
        $match: {
          user: guestId,
          reviewType: 'host_to_guest',
          status: 'published'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$guestRatings.overall' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (averageRating.length > 0) {
      await User.findByIdAndUpdate(guestId, {
        'guestProfile.rating': parseFloat(averageRating[0].averageRating.toFixed(2)),
        'guestProfile.reviewCount': averageRating[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating guest rating:', error);
  }
};