import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "host", "admin"], default: "user" },
    phone: String,
    profileImage: {
      url: String,
      public_id: String,
    },
    // Host-specific fields
    hostProfile: {
      isHost: { type: Boolean, default: false },
      hostSince: { type: Date },
      hostVerified: { type: Boolean, default: false },
      hostRating: { type: Number, min: 1, max: 5 },
      totalReviews: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      responseRate: { type: Number, default: 100 }, // percentage
      responseTime: { type: String, default: "within an hour" },
      superhost: { type: Boolean, default: false },
      // Financial tracking
      totalEarnings: { type: Number, default: 0 },
      availableEarnings: { type: Number, default: 0 },
      totalPayouts: { type: Number, default: 0 }
    },
    
    // Guest profile fields
    guestProfile: {
      rating: { type: Number, min: 1, max: 5 },
      reviewCount: { type: Number, default: 0 },
      verificationLevel: { 
        type: String, 
        enum: ['none', 'basic', 'verified', 'premium'],
        default: 'none'
      },
      totalBookings: { type: Number, default: 0 },
      memberSince: { type: Date, default: Date.now }
    },

    // Notification preferences
    notificationPreferences: {
      bookingRequests: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      },
      bookingUpdates: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      },
      payments: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      },
      reviews: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      },
      messages: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
      },
      promotions: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
      },
      reminders: { 
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      }
    },

    // Payout information
    payoutMethods: [{
      type: {
        type: String,
        enum: ['bank_transfer', 'upi', 'wallet']
      },
      isDefault: { type: Boolean, default: false },
      // Bank transfer details
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
      bankName: String,
      // UPI details
      upiId: String,
      // Wallet details
      walletId: String,
      walletType: String,
      isVerified: { type: Boolean, default: false },
      addedAt: { type: Date, default: Date.now }
    }],
    bio: { type: String, maxLength: 500 },
    dateOfBirth: { type: Date },
    location: { type: String },
    languages: [{ type: String }],
    verified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Check if the model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;