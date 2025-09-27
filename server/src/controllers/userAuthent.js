import redisClient from "../config/redis.js";
import User from "../models/user.js";
import OTP from "../models/otp.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import { sendOTPEmail } from '../services/emailService.js';

// Step 1: Send OTP for registration
export const sendSignupOTP = async (req, res) => {
  try {
    console.log('📧 Received signup OTP request:', req.body);
    const { firstName, lastName, emailId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Delete any existing OTP for this email and purpose
    await OTP.deleteMany({ emailId, purpose: 'signup' });

    // Generate new OTP
    const otp = OTP.generateOTP();

    // Hash the password before storing in temporary data
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new OTP record
    await OTP.create({
      emailId,
      otp,
      purpose: 'signup',
      userData: {
        firstName,
        lastName,
        password: hashedPassword
      }
    });

    // Send OTP email
    await sendOTPEmail(emailId, otp, 'signup', firstName);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully",
      emailId // Return for frontend reference
    });

  } catch (err) {
    console.error('Send signup OTP error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Step 2: Verify OTP and complete registration
export const verifySignupOTP = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      emailId, 
      purpose: 'signup',
      isUsed: false 
    }).sort({ createdAt: -1 }); // Get the latest OTP

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No valid OTP found for this email"
      });
    }

    // Verify OTP
    try {
      otpRecord.verifyOTP(otp);
    } catch (otpError) {
      return res.status(400).json({
        success: false,
        message: otpError.message
      });
    }

    // Create the user account
    const user = await User.create({
      firstName: otpRecord.userData.firstName,
      lastName: otpRecord.userData.lastName,
      emailId: otpRecord.emailId,
      password: otpRecord.userData.password, // Already hashed
      role: 'user'
    });

    // Clean up the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const reply = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie('token', token, { 
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(201).json({
      success: true,
      user: reply,
      token: token,
      message: "Account created successfully"
    });

  } catch (err) {
    console.error('Verify signup OTP error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Resend OTP for signup
export const resendSignupOTP = async (req, res) => {
  try {
    const { emailId } = req.body;

    // Find the latest OTP record to get user data
    const otpRecord = await OTP.findOne({ 
      emailId, 
      purpose: 'signup'
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No signup request found for this email"
      });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ emailId, purpose: 'signup' });

    // Generate new OTP
    const otp = OTP.generateOTP();

    // Create new OTP record with existing user data
    await OTP.create({
      emailId,
      otp,
      purpose: 'signup',
      userData: otpRecord.userData
    });

    // Send new OTP email
    await sendOTPEmail(emailId, otp, 'signup', otpRecord.userData.firstName);

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email"
    });

  } catch (err) {
    console.error('Resend signup OTP error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const register = async (req, res) => {
  try {
    // Data is already validated by Zod middleware
    const { firstName, emailId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const user = await User.create({
      firstName,
      emailId,
      password,
      role: 'user'
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie('token', token, { 
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(201).json({
      success: true,
      user: reply,
      token: token,
      message: "Registered successfully"
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', req.body);
    
    // Data is already validated by Zod middleware
    const { emailId, password } = req.body;

    console.log('Looking for user with email:', emailId);
    const user = await User.findOne({ emailId });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    console.log('User found, checking password...');
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    console.log('Password matches, generating token...');
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Setting cookie and sending response...');
    res.cookie('token', token, { 
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    const response = {
      success: true,
      user: reply,
      token: token,
      message: "Login successful"
    };
    
    console.log('=== LOGIN SUCCESS ===');
    console.log('Response:', response);
    
    res.status(200).json(response);
  } catch (err) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (token) {
      const payload = jwt.decode(token);
      await redisClient.set(`token:${token}`, 'Blocked');
      await redisClient.expireAt(`token:${token}`, payload.exp);
    }
    
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const adminRegister = async (req, res) => {
  try {
    // Data is already validated by Zod middleware
    const { firstName, emailId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const user = await User.create({
      firstName,
      emailId,
      password,
      role: 'admin'
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.cookie('token', token, { 
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role
      },
      token: token
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({
      success: false,
      message: "Admin registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);

    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      message: "Profile deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      user
    });
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, bio, location, dateOfBirth, languages, phone } = req.body;
    
    const updateData = {
      firstName,
      lastName,
      bio,
      location,
      dateOfBirth,
      languages,
      phone,
      profileCompleted: true
    };

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      user,
      message: "Profile updated successfully"
    });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(400).json({
      error: err.message
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!req.file) {
      return res.status(400).json({
        error: "No image file provided"
      });
    }

    // Upload image to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'wanderlust/profiles',
          public_id: `profile_${userId}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const profileImage = {
      url: result.secure_url,
      public_id: result.public_id
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      user,
      message: "Profile image updated successfully"
    });
  } catch (err) {
    console.error('Error uploading profile image:', err);
    res.status(500).json({
      error: "Failed to upload image: " + err.message
    });
  }
};

// Convert user to host
export const becomeHost = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user is already a host
    if (user.role === 'host' || user.hostProfile?.isHost) {
      return res.status(400).json({
        success: false,
        error: 'User is already a host'
      });
    }

    // Update user to host
    user.role = 'host';
    user.hostProfile = {
      isHost: true,
      hostSince: new Date(),
      hostVerified: false,
      hostRating: 0,
      totalReviews: 0,
      responseRate: 100,
      responseTime: 'within an hour',
      superhost: false
    };

    await user.save();

    // Remove password from response
    const { password, ...userResponse } = user.toObject();

    res.status(200).json({
      success: true,
      message: 'Successfully became a host! You can now create property listings.',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};