import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'system', 'booking_update'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  // For file attachments (optional)
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ booking: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1, createdAt: -1 });

// Check if the model already exists to prevent OverwriteModelError
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;