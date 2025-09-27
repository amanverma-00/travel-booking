import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_approved',
      'booking_rejected',
      'booking_confirmed',
      'booking_cancelled',
      'payment_received',
      'review_received',
      'payout_processed',
      'message_received',
      'listing_approved',
      'listing_rejected',
      'reminder',
      'system_update'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  message: {
    type: String,
    required: true,
    maxLength: 500
  },
  data: {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    payout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payout'
    },
    amount: Number,
    url: String,
    actionRequired: Boolean
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  readAt: Date,
  emailSentAt: Date,
  smsSentAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ 'data.booking': 1 });
notificationSchema.index({ 'data.listing': 1 });

// Virtual for age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Methods
notificationSchema.methods.markAsRead = function() {
  if (this.status === 'unread') {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

notificationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Static methods for creating specific notification types
notificationSchema.statics.createBookingNotification = function(type, recipient, booking, sender = null) {
  const notificationData = {
    recipient,
    sender,
    type,
    data: { booking: booking._id, actionRequired: false }
  };

  switch (type) {
    case 'booking_request':
      notificationData.title = 'New Booking Request';
      notificationData.message = `You have a new booking request for ${booking.listing?.title || 'your property'}`;
      notificationData.priority = 'high';
      notificationData.data.actionRequired = true;
      notificationData.channels.email = true;
      break;
    
    case 'booking_approved':
      notificationData.title = 'Booking Approved!';
      notificationData.message = `Your booking request has been approved by the host`;
      notificationData.priority = 'high';
      notificationData.channels.email = true;
      break;
    
    case 'booking_rejected':
      notificationData.title = 'Booking Request Declined';
      notificationData.message = `Unfortunately, your booking request has been declined`;
      notificationData.priority = 'normal';
      notificationData.channels.email = true;
      break;
    
    case 'booking_confirmed':
      notificationData.title = 'Booking Confirmed';
      notificationData.message = `Your booking is confirmed! Check-in details will be sent soon.`;
      notificationData.priority = 'high';
      notificationData.channels.email = true;
      break;
  }

  return this.create(notificationData);
};

notificationSchema.statics.createPaymentNotification = function(recipient, amount, type = 'payment_received') {
  return this.create({
    recipient,
    type,
    title: 'Payment Received',
    message: `You received a payment of ₹${amount}`,
    data: { amount },
    priority: 'normal',
    channels: { inApp: true, email: true }
  });
};

notificationSchema.statics.createReviewNotification = function(recipient, sender, reviewType, rating) {
  const isHostReview = reviewType === 'host_to_guest';
  return this.create({
    recipient,
    sender,
    type: 'review_received',
    title: isHostReview ? 'New Review from Host' : 'New Review Received',
    message: `You received a ${rating}-star review`,
    priority: 'normal'
  });
};

notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    status = null,
    limit = 20,
    skip = 0,
    types = null
  } = options;

  const query = { recipient: userId };
  
  if (status) {
    query.status = status;
  }
  
  if (types && types.length > 0) {
    query.type = { $in: types };
  }

  return this.find(query)
    .populate('sender', 'name profilePicture')
    .populate('data.booking', 'startDate endDate totalAmount')
    .populate('data.listing', 'title images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Safe model compilation
let Notification;
try {
  Notification = mongoose.model('Notification');
} catch (error) {
  Notification = mongoose.model('Notification', notificationSchema);
}

export default Notification;