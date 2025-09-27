import mongoose from 'mongoose';

const earningsSchema = new mongoose.Schema({
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
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  grossAmount: {
    type: Number,
    required: true,
    min: 0
  },
  hostEarnings: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  paymentProcessingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  taxes: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'paid_out', 'on_hold'],
    default: 'pending'
  },
  availableAt: {
    type: Date,
    // Earnings become available 24 hours after check-in
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  },
  paidOutAt: Date,
  payout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payout'
  },
  metadata: {
    bookingDates: {
      checkIn: Date,
      checkOut: Date
    },
    guests: Number,
    nights: Number,
    pricePerNight: Number
  }
}, {
  timestamps: true
});

// Indexes
earningsSchema.index({ host: 1, status: 1 });
earningsSchema.index({ availableAt: 1, status: 1 });
earningsSchema.index({ booking: 1 }, { unique: true });
earningsSchema.index({ listing: 1, createdAt: -1 });

// Virtual for net earnings
earningsSchema.virtual('netEarnings').get(function() {
  return this.hostEarnings - this.taxes - this.paymentProcessingFee;
});

// Virtual for platform fee rate
earningsSchema.virtual('platformFeeRate').get(function() {
  if (this.grossAmount === 0) return 0;
  return ((this.platformFee / this.grossAmount) * 100).toFixed(2);
});

// Methods
earningsSchema.methods.makeAvailable = function() {
  if (this.status === 'pending' && new Date() >= this.availableAt) {
    this.status = 'available';
    return this.save();
  }
  return Promise.resolve(this);
};

earningsSchema.methods.markAsPaidOut = function(payoutId) {
  this.status = 'paid_out';
  this.paidOutAt = new Date();
  this.payout = payoutId;
  return this.save();
};

// Static methods
earningsSchema.statics.getAvailableEarnings = function(hostId) {
  return this.aggregate([
    {
      $match: {
        host: hostId,
        status: 'available',
        availableAt: { $lte: new Date() }
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$hostEarnings' },
        totalGross: { $sum: '$grossAmount' },
        totalFees: { $sum: '$platformFee' },
        count: { $sum: 1 }
      }
    }
  ]);
};

earningsSchema.statics.getEarningsByPeriod = function(hostId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        host: hostId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalEarnings: { $sum: '$hostEarnings' },
        totalBookings: { $sum: 1 },
        averageBookingValue: { $avg: '$grossAmount' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};

// Safe model compilation
let Earnings;
try {
  Earnings = mongoose.model('Earnings');
} catch (error) {
  Earnings = mongoose.model('Earnings', earningsSchema);
}

export default Earnings;