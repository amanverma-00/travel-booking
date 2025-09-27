import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'blocked', 'booked'],
    default: 'available'
  },
  price: {
    type: Number,
    min: 0
  },
  // For blocked dates
  blockReason: {
    type: String,
    maxLength: 200
  },
  // Reference to booking if status is 'booked'
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, {
  timestamps: true
});

// Compound index for efficient date range queries
calendarSchema.index({ listing: 1, date: 1 }, { unique: true });
calendarSchema.index({ listing: 1, status: 1, date: 1 });

// Check if the model already exists to prevent OverwriteModelError
const Calendar = mongoose.models.Calendar || mongoose.model("Calendar", calendarSchema);

export default Calendar;