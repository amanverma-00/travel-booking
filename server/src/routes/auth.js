import express from 'express';
import {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
  getProfile,
  updateProfile,
  uploadProfileImage,
  becomeHost,
  sendSignupOTP,
  verifySignupOTP,
  resendSignupOTP
} from '../controllers/userAuthent.js';
import { userMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { validate, validateFile, mongoIdSchema } from '../middleware/validationMiddleware.js';
import {
  registerSchema,
  loginSchema,
  createAdminSchema,
  updateProfileSchema,
  becomeHostSchema,
  sendSignupOTPSchema,
  verifyOTPSchema,
  resendOTPSchema
} from '../validations/authValidation.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for Cloudinary

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

// OTP-based registration routes
router.post('/send-signup-otp', validate(sendSignupOTPSchema), sendSignupOTP);
router.post('/verify-signup-otp', validate(verifyOTPSchema), verifySignupOTP);
router.post('/resend-signup-otp', validate(resendOTPSchema), resendSignupOTP);

// Traditional authentication routes with validation
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', userMiddleware, logout);
router.post('/admin/register', adminMiddleware, validate(createAdminSchema), adminRegister);

// Profile management routes
router.delete('/deleteProfile', userMiddleware, deleteProfile);
router.get('/profile', userMiddleware, getProfile);
router.put('/profile', userMiddleware, validate(updateProfileSchema), updateProfile);
router.post('/upload-profile-image', 
  userMiddleware, 
  upload.single('profileImage'), 
  validateFile({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    required: true,
    fieldName: 'profileImage'
  }), 
  uploadProfileImage
);
router.post('/become-host', userMiddleware, validate(becomeHostSchema), becomeHost);

export default router;