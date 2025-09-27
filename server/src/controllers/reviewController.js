import Review from "../models/review.js";
import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { listingId, bookingId, rating, comment } = req.body;

    // Check if listingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create reviews for mock listings. Please create reviews for database listings only.'
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this listing'
      });
    }

    // If bookingId is provided, verify it
    let isVerified = false;
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking && booking.user.toString() === req.user._id.toString() && booking.status === 'completed') {
        isVerified = true;
      }
    }

    // Create review (with or without booking)
    const review = await Review.create({
      listing: listingId,
      user: req.user._id,
      booking: bookingId || undefined,
      rating,
      comment,
      isVerified: isVerified
    });

    // Update listing ratings
    const reviews = await Review.find({ listing: listingId });
    const ratingsQuantity = reviews.length;
    const ratingsAverage = reviews.reduce((acc, review) => acc + review.rating, 0) / ratingsQuantity;

    listing.ratingsAverage = parseFloat(ratingsAverage.toFixed(1));
    listing.ratingsQuantity = ratingsQuantity;
    await listing.save();

    // Populate review data
    await review.populate([
      { path: 'user', select: 'firstName profileImage' },
      { path: 'listing', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Check if listingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      // For mock data with string IDs, return empty array since they don't exist in DB
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const reviews = await Review.find({ listing: listingId })
      .populate('user', 'firstName profileImage')
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

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user is authorized to update this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'firstName profileImage' },
      { path: 'listing', select: 'title' }
    ]);

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user is authorized to delete this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    // Delete review
    await review.remove();

    // Update listing ratings
    const listing = await Listing.findById(review.listing);
    const reviews = await Review.find({ listing: review.listing });
    const ratingsQuantity = reviews.length;
    
    if (ratingsQuantity === 0) {
      listing.ratingsAverage = 0;
    } else {
      const ratingsAverage = reviews.reduce((acc, review) => acc + review.rating, 0) / ratingsQuantity;
      listing.ratingsAverage = parseFloat(ratingsAverage.toFixed(1));
    }
    
    listing.ratingsQuantity = ratingsQuantity;
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const reviews = await Review.find({ user: userId })
      .populate({
        path: 'listing',
        select: 'title location images'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};