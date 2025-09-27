import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    bookings: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    occupancyRate: {
      type: Number,
      default: 0
    }
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  demographics: {
    ageGroups: {
      '18-25': { type: Number, default: 0 },
      '26-35': { type: Number, default: 0 },
      '36-45': { type: Number, default: 0 },
      '46-55': { type: Number, default: 0 },
      '56-65': { type: Number, default: 0 },
      '65+': { type: Number, default: 0 }
    },
    guestTypes: {
      business: { type: Number, default: 0 },
      leisure: { type: Number, default: 0 },
      family: { type: Number, default: 0 },
      couple: { type: Number, default: 0 },
      solo: { type: Number, default: 0 },
      group: { type: Number, default: 0 }
    },
    regions: {
      domestic: { type: Number, default: 0 },
      international: { type: Number, default: 0 }
    }
  },
  seasonalData: {
    season: {
      type: String,
      enum: ['spring', 'summer', 'monsoon', 'winter']
    },
    peakDays: [String],
    lowDays: [String],
    averagePricePerNight: Number,
    demandIndex: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  competitorAnalysis: {
    averageMarketPrice: Number,
    pricePosition: {
      type: String,
      enum: ['below', 'average', 'above']
    },
    marketShare: Number,
    competitorCount: Number
  }
}, {
  timestamps: true,
  indexes: [
    { listingId: 1, date: 1 },
    { hostId: 1, period: 1, date: -1 },
    { date: -1, period: 1 }
  ]
});

// Static method to aggregate analytics data
analyticsSchema.statics.getAggregatedData = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: {
          period: '$period',
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date'
            }
          }
        },
        totalViews: { $sum: '$metrics.views' },
        totalInquiries: { $sum: '$metrics.inquiries' },
        totalBookings: { $sum: '$metrics.bookings' },
        totalRevenue: { $sum: '$metrics.revenue' },
        avgRating: { $avg: '$metrics.averageRating' },
        avgConversion: { $avg: '$metrics.conversionRate' },
        avgOccupancy: { $avg: '$metrics.occupancyRate' }
      }
    },
    { $sort: { '_id.date': -1 } }
  ];

  return this.aggregate(pipeline);
};

// Method to calculate trends
analyticsSchema.statics.getTrends = async function(listingId, period = 'monthly') {
  const pipeline = [
    { $match: { listingId: mongoose.Types.ObjectId(listingId), period } },
    { $sort: { date: -1 } },
    { $limit: 12 }, // Last 12 periods
    {
      $group: {
        _id: null,
        data: { $push: '$$ROOT' },
        avgRevenue: { $avg: '$metrics.revenue' },
        avgBookings: { $avg: '$metrics.bookings' },
        avgOccupancy: { $avg: '$metrics.occupancyRate' }
      }
    }
  ];

  return this.aggregate(pipeline);
};

export default mongoose.model('Analytics', analyticsSchema);