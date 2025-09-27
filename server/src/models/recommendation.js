import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['listing', 'destination', 'experience', 'pricing', 'amenity'],
    required: true
  },
  recommendations: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      enum: ['listing', 'destination', 'experience'],
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    reasons: [{
      factor: {
        type: String,
        enum: ['past_bookings', 'similar_users', 'price_preference', 'location_preference', 
               'amenity_preference', 'rating_preference', 'seasonal_pattern', 'trending']
      },
      weight: {
        type: Number,
        min: 0,
        max: 1
      },
      explanation: String
    }],
    metadata: {
      listingTitle: String,
      imageUrl: String,
      price: Number,
      rating: Number,
      location: {
        city: String,
        state: String,
        country: String
      }
    }
  }],
  userProfile: {
    preferences: {
      priceRange: {
        min: Number,
        max: Number
      },
      preferredLocations: [String],
      preferredAmenities: [String],
      travelStyle: {
        type: String,
        enum: ['luxury', 'budget', 'mid-range', 'unique', 'family-friendly', 'business']
      },
      groupSize: {
        type: String,
        enum: ['solo', 'couple', 'small-group', 'large-group', 'family']
      },
      tripPurpose: {
        type: String,
        enum: ['leisure', 'business', 'adventure', 'relaxation', 'cultural', 'events']
      }
    },
    behaviorData: {
      searchHistory: [{
        query: String,
        location: String,
        dateRange: {
          checkIn: Date,
          checkOut: Date
        },
        priceFilter: {
          min: Number,
          max: Number
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      viewHistory: [{
        listingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Listing'
        },
        viewDuration: Number, // in seconds
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      bookingHistory: [{
        listingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Listing'
        },
        bookingDate: Date,
        stayDuration: Number, // in days
        price: Number,
        rating: Number,
        location: String
      }]
    },
    demographics: {
      ageRange: {
        type: String,
        enum: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
      },
      location: {
        city: String,
        state: String,
        country: String
      }
    }
  },
  algorithm: {
    version: {
      type: String,
      default: '1.0'
    },
    model: {
      type: String,
      enum: ['collaborative_filtering', 'content_based', 'hybrid', 'deep_learning'],
      default: 'hybrid'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    executionTime: Number // in milliseconds
  },
  performance: {
    clickThroughRate: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    userFeedback: {
      type: String,
      enum: ['helpful', 'not_helpful', 'irrelevant']
    },
    interactions: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 }
    }
  },
  validUntil: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
  }
}, {
  timestamps: true,
  indexes: [
    { userId: 1, type: 1, createdAt: -1 },
    { validUntil: 1 },
    { 'recommendations.score': -1 },
    { 'algorithm.model': 1, createdAt: -1 }
  ]
});

// Generate recommendations based on user profile and behavior
recommendationSchema.statics.generateRecommendations = async function(userId, type = 'listing', limit = 10) {
  const User = mongoose.model('User');
  const Listing = mongoose.model('Listing');
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  // Get user's booking and search history
  const userHistory = await this.getUserBehaviorData(userId);
  
  let recommendations = [];
  
  switch (type) {
    case 'listing':
      recommendations = await this.generateListingRecommendations(user, userHistory, limit);
      break;
    case 'destination':
      recommendations = await this.generateDestinationRecommendations(user, userHistory, limit);
      break;
    case 'experience':
      recommendations = await this.generateExperienceRecommendations(user, userHistory, limit);
      break;
    default:
      recommendations = await this.generateListingRecommendations(user, userHistory, limit);
  }
  
  // Store recommendations
  const newRecommendation = new this({
    userId,
    type,
    recommendations,
    userProfile: {
      preferences: user.preferences || {},
      behaviorData: userHistory,
      demographics: {
        ageRange: user.ageRange,
        location: user.location
      }
    },
    algorithm: {
      version: '1.0',
      model: 'hybrid',
      confidence: this.calculateConfidence(recommendations),
      executionTime: Date.now() - startTime
    }
  });
  
  await newRecommendation.save();
  return newRecommendation;
};

// Generate listing recommendations using hybrid approach
recommendationSchema.statics.generateListingRecommendations = async function(user, userHistory, limit) {
  const Listing = mongoose.model('Listing');
  
  // Content-based filtering
  const contentBased = await this.getContentBasedRecommendations(user, userHistory, limit);
  
  // Collaborative filtering
  const collaborative = await this.getCollaborativeRecommendations(user, userHistory, limit);
  
  // Trending listings
  const trending = await this.getTrendingListings(limit);
  
  // Combine and rank recommendations
  const combined = this.combineRecommendations([
    { type: 'content', recommendations: contentBased, weight: 0.4 },
    { type: 'collaborative', recommendations: collaborative, weight: 0.4 },
    { type: 'trending', recommendations: trending, weight: 0.2 }
  ]);
  
  return combined.slice(0, limit);
};

// Content-based recommendations
recommendationSchema.statics.getContentBasedRecommendations = async function(user, userHistory, limit) {
  const Listing = mongoose.model('Listing');
  
  // Analyze user preferences from booking history
  const preferences = this.extractUserPreferences(userHistory);
  
  const query = {
    isActive: true
  };
  
  // Add filters based on preferences
  if (preferences.priceRange) {
    query.pricing = {
      $gte: preferences.priceRange.min,
      $lte: preferences.priceRange.max
    };
  }
  
  if (preferences.preferredLocations?.length > 0) {
    query['location.city'] = { $in: preferences.preferredLocations };
  }
  
  if (preferences.preferredAmenities?.length > 0) {
    query.amenities = { $in: preferences.preferredAmenities };
  }
  
  const listings = await Listing.find(query)
    .limit(limit * 2) // Get more to allow for scoring
    .populate('host', 'name rating')
    .lean();
  
  // Score listings based on user preferences
  const scoredListings = listings.map(listing => ({
    itemId: listing._id,
    itemType: 'listing',
    score: this.calculateContentScore(listing, preferences),
    reasons: this.generateContentReasons(listing, preferences),
    metadata: {
      listingTitle: listing.title,
      imageUrl: listing.images?.[0] || '',
      price: listing.pricing,
      rating: listing.averageRating,
      location: listing.location
    }
  }));
  
  return scoredListings.sort((a, b) => b.score - a.score);
};

// Calculate content-based score
recommendationSchema.statics.calculateContentScore = function(listing, preferences) {
  let score = 0;
  
  // Price alignment (higher score for closer to preferred range)
  if (preferences.priceRange) {
    const priceScore = this.calculatePriceScore(listing.pricing, preferences.priceRange);
    score += priceScore * 0.3;
  }
  
  // Location preference
  if (preferences.preferredLocations?.includes(listing.location.city)) {
    score += 0.25;
  }
  
  // Amenity match
  const amenityScore = this.calculateAmenityScore(listing.amenities, preferences.preferredAmenities);
  score += amenityScore * 0.2;
  
  // Rating bonus
  score += (listing.averageRating / 5) * 0.15;
  
  // Availability bonus
  score += listing.isActive ? 0.1 : 0;
  
  return Math.min(score, 1); // Cap at 1.0
};

export default mongoose.model('Recommendation', recommendationSchema);