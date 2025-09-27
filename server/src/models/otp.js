import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['signup', 'login', 'password-reset'],
      required: true,
    },
    userData: {
      // Store temporary user data for signup
      firstName: String,
      lastName: String,
      password: String,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      index: { expires: 0 }
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
otpSchema.index({ emailId: 1, purpose: 1 });

// Method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Method to verify OTP
otpSchema.methods.verifyOTP = function(inputOTP) {
  if (this.isUsed) {
    throw new Error('OTP has already been used');
  }
  
  if (this.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }
  
  if (this.attempts >= 3) {
    throw new Error('Too many failed attempts');
  }
  
  if (this.otp !== inputOTP) {
    this.attempts += 1;
    this.save();
    throw new Error('Invalid OTP');
  }
  
  this.isUsed = true;
  this.save();
  return true;
};

export default mongoose.model("OTP", otpSchema);