import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    suggestedPrice: {
      type: Number,
      required: true
    },
    aiOptimizedPrice: {
      type: Number,
      required: true
    },
    demandMultiplier: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 5.0
    },
    seasonalMultiplier: {
      type: Number,
      default: 1.0,
      min: 0.7,
      max: 2.0
    },
    competitorMultiplier: {
      type: Number,
      default: 1.0,
      min: 0.8,
      max: 1.5
    },
    eventMultiplier: {
      type: Number,
      default: 1.0,
      min: 1.0,
      max: 3.0
    }
  },
  factors: {
    localDemand: {
      type: Number,
      min: 0,
      max: 100
    },
    seasonality: {
      type: String,
      enum: ['low', 'medium', 'high', 'peak']
    },
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    isWeekend: {
      type: Boolean,
      default: false
    },
    isHoliday: {
      type: Boolean,
      default: false
    },
    localEvents: [{
      name: String,
      type: {
        type: String,
        enum: ['festival', 'conference', 'sports', 'concert', 'cultural', 'business']
      },
      impact: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      startDate: Date,
      endDate: Date
    }],
    weatherFactor: {
      type: Number,
      min: 0.5,
      max: 1.5,
      default: 1.0
    },
    competitorPricing: {
      averagePrice: Number,
      minPrice: Number,
      maxPrice: Number,
      pricePosition: {
        type: String,
        enum: ['lowest', 'below-average', 'average', 'above-average', 'highest']
      }
    }
  },
  performance: {
    bookingProbability: {
      type: Number,
      min: 0,
      max: 100
    },
    revenueProjection: Number,
    competitiveScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  recommendations: {
    priceAction: {
      type: String,
      enum: ['increase', 'decrease', 'maintain', 'dynamic']
    },
    reasoning: String,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    impactEstimate: {
      bookingIncrease: String,
      revenueIncrease: String
    }
  },
  appliedPrice: {
    type: Number
  },
  appliedAt: Date,
  results: {
    actualBookings: Number,
    actualRevenue: Number,
    performanceVsPrediction: {
      bookingAccuracy: Number,
      revenueAccuracy: Number
    }
  }
}, {
  timestamps: true,
  indexes: [
    { listingId: 1, date: 1 },
    { date: -1 },
    { 'pricing.aiOptimizedPrice': 1 }
  ]
});

// Static method to get pricing recommendations
pricingSchema.statics.getPricingRecommendation = async function(listingId, targetDate) {
  const factors = await this.analyzeMarketFactors(listingId, targetDate);
  const basePrice = await this.getBasePrice(listingId);
  
  const aiOptimizedPrice = this.calculateOptimalPrice(basePrice, factors);
  
  return {
    basePrice,
    suggestedPrice: aiOptimizedPrice,
    factors,
    confidence: this.calculateConfidence(factors)
  };
};

// Calculate optimal price using AI factors
pricingSchema.statics.calculateOptimalPrice = function(basePrice, factors) {
  let multiplier = 1.0;
  
  // Demand-based adjustment
  multiplier *= factors.demandMultiplier || 1.0;
  
  // Seasonal adjustment
  multiplier *= factors.seasonalMultiplier || 1.0;
  
  // Competition adjustment  
  multiplier *= factors.competitorMultiplier || 1.0;
  
  // Event adjustment
  multiplier *= factors.eventMultiplier || 1.0;
  
  // Weekend/holiday premium
  if (factors.isWeekend || factors.isHoliday) {
    multiplier *= 1.2;
  }
  
  return Math.round(basePrice * multiplier);
};

// Analyze market factors for pricing
pricingSchema.statics.analyzeMarketFactors = async function(listingId, targetDate) {
  // This would integrate with external APIs for real market data
  // For now, we'll simulate market analysis
  
  const date = new Date(targetDate);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
  
  // Simulate seasonal demand
  const month = date.getMonth();
  let seasonality = 'medium';
  let seasonalMultiplier = 1.0;
  
  if (month >= 2 && month <= 5) { // Mar-Jun (peak travel)
    seasonality = 'high';
    seasonalMultiplier = 1.3;
  } else if (month >= 9 && month <= 11) { // Oct-Dec (festival season)
    seasonality = 'peak';
    seasonalMultiplier = 1.5;
  } else if (month >= 6 && month <= 8) { // Jul-Sep (monsoon)
    seasonality = 'low';
    seasonalMultiplier = 0.8;
  }
  
  // Simulate demand (would use real booking data)
  const localDemand = Math.floor(Math.random() * 40) + 60; // 60-100
  
  return {
    localDemand,
    seasonality,
    dayOfWeek,
    isWeekend,
    isHoliday: false, // Would check holiday calendar
    demandMultiplier: localDemand / 80, // Normalize to multiplier
    seasonalMultiplier,
    competitorMultiplier: 1.0, // Would analyze competitor prices
    eventMultiplier: 1.0 // Would check local events
  };
};

export default mongoose.model('PricingOptimization', pricingSchema);