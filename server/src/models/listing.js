import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'villa', 'cabin', 'cottage', 'loft', 'townhouse', 'guesthouse', 'hotel', 'bed_breakfast', 'other'],
    required: true
  },
  roomType: {
    type: String,
    enum: ['entire_place', 'private_room', 'shared_room', 'hotel_room'],
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  capacity: {
    maxGuests: {
      type: Number,
      required: true,
      min: 1
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    beds: {
      type: Number,
      required: true,
      min: 1
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1
    }
  },
  amenities: [{
    type: String
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    cleaningFee: {
      type: Number,
      default: 0,
      min: 0
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: 0
    },
    weeklyDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 99
    },
    monthlyDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 99
    }
  },
  images: [{
    type: String // Cloudinary URLs
  }],
  houseRules: {
    checkIn: {
      type: String,
      default: '15:00'
    },
    checkOut: {
      type: String,
      default: '11:00'
    },
    instantBook: {
      type: Boolean,
      default: false
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    eventsAllowed: {
      type: Boolean,
      default: false
    }
  },
  policies: {
    cancellation: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    minimumStay: {
      type: Number,
      default: 1,
      min: 1
    },
    maximumStay: {
      type: Number,
      default: 365,
      min: 1
    }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    default: 'trending'
  }
}, {
  timestamps: true
});

// Index for search functionality
listingSchema.index({
  'location.city': 'text',
  'location.state': 'text',
  'location.country': 'text',
  title: 'text',
  description: 'text'
});

// Index for location-based queries
listingSchema.index({ 'location.coordinates': '2dsphere' });

// Check if the model already exists to prevent OverwriteModelError
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;