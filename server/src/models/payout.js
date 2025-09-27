import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  }],
  amount: {
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
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  payoutMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'wallet'],
    required: true
  },
  payoutDetails: {
    // For bank transfer
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
    
    // For UPI
    upiId: String,
    
    // For wallet
    walletId: String,
    walletType: String
  },
  transactionId: String,
  processedAt: Date,
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  failureReason: String,
  metadata: {
    period: {
      startDate: Date,
      endDate: Date
    },
    bookingCount: Number,
    averageBookingValue: Number
  }
}, {
  timestamps: true
});

// Indexes
payoutSchema.index({ host: 1, status: 1 });
payoutSchema.index({ scheduledAt: 1 });
payoutSchema.index({ status: 1, scheduledAt: 1 });

// Calculate total amount before save
payoutSchema.pre('save', function(next) {
  this.amount = this.hostEarnings + this.platformFee;
  next();
});

// Virtual for payout rate
payoutSchema.virtual('payoutRate').get(function() {
  if (this.amount === 0) return 0;
  return ((this.hostEarnings / this.amount) * 100).toFixed(2);
});

// Safe model compilation
let Payout;
try {
  Payout = mongoose.model('Payout');
} catch (error) {
  Payout = mongoose.model('Payout', payoutSchema);
}

export default Payout;