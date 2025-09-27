import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  // Review type: guest reviewing property/host or host reviewing guest
  reviewType: {
    type: String,
    enum: ['guest_to_host', 'host_to_guest'],
    required: true
  },
  
  // Rating categories for guest reviews
  ratings: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    checkIn: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // For host reviews of guests
  guestRatings: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    respectfulness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  comment: {
    type: String,
    required: true,
    maxLength: 1000
  },
  
  // Private feedback (only visible to the platform)
  privateFeedback: {
    type: String,
    maxLength: 500
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Review status
  status: {
    type: String,
    enum: ['pending', 'published', 'hidden', 'flagged'],
    default: 'published'
  },
  
  // Response from the reviewed party
  response: {
    content: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Helpfulness votes
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    voters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // Review metadata
  metadata: {
    stayDuration: Number, // nights
    travelType: {
      type: String,
      enum: ['business', 'leisure', 'family', 'couple', 'solo', 'friends']
    },
    recommendToFriends: Boolean
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ listing: 1, reviewType: 1, status: 1 });
reviewSchema.index({ user: 1, reviewType: 1 });
reviewSchema.index({ host: 1, reviewType: 1 });
reviewSchema.index({ booking: 1, reviewType: 1 }, { unique: true });
reviewSchema.index({ 'ratings.overall': -1, status: 1 });

// Virtual for average rating calculation
reviewSchema.virtual('averageRating').get(function() {
  if (this.reviewType === 'guest_to_host') {
    const ratings = this.ratings;
    const ratingValues = [
      ratings.overall,
      ratings.cleanliness,
      ratings.accuracy,
      ratings.communication,
      ratings.location,
      ratings.checkIn,
      ratings.value
    ].filter(rating => rating != null);
    
    if (ratingValues.length === 0) return 0;
    return (ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length).toFixed(2);
  } else {
    const ratings = this.guestRatings;
    const ratingValues = [
      ratings.overall,
      ratings.communication,
      ratings.cleanliness,
      ratings.respectfulness
    ].filter(rating => rating != null);
    
    if (ratingValues.length === 0) return 0;
    return (ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length).toFixed(2);
  }
});

// Methods
reviewSchema.methods.addResponse = function(content, responderId) {
  this.response = {
    content,
    respondedAt: new Date(),
    respondedBy: responderId
  };
  return this.save();
};

reviewSchema.methods.addHelpfulVote = function(userId) {
  if (!this.helpful.voters.includes(userId)) {
    this.helpful.voters.push(userId);
    this.helpful.count += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

reviewSchema.methods.removeHelpfulVote = function(userId) {
  const index = this.helpful.voters.indexOf(userId);
  if (index > -1) {
    this.helpful.voters.splice(index, 1);
    this.helpful.count -= 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Safe model compilation
let Review;
try {
  Review = mongoose.model('Review');
} catch (error) {
  Review = mongoose.model('Review', reviewSchema);
}

export default Review;