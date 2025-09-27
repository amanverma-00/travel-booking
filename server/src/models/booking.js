import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  cleaningFee: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  guests: {
    adults: {
      type: Number,
      required: true
    },
    children: {
      type: Number,
      default: 0
    }
  },
  specialRequests: {
    type: String,
    maxLength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  // Host interaction fields
  hostMessage: {
    type: String,
    maxLength: 500
  },
  rejectionReason: {
    type: String,
    maxLength: 500
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }
}, {
  timestamps: true
});

// Check if the model already exists to prevent OverwriteModelError
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;