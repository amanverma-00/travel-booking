import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import redisClient from './config/redis.js';

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';
import calendarRoutes from './routes/calendar.js';
import messageRoutes from './routes/messages.js';
import financialRoutes from './routes/financial.js';
import enhancedReviewRoutes from './routes/enhancedReview.js';
import notificationRoutes from './routes/notification.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server initialization...');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

console.log('✅ Express middleware configured');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('📁 Static file serving configured');

// Connect to databases
(async () => {
  try {
    console.log('🔌 Connecting to databases...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    // Don't exit the process, continue running the server
  }
})();

// Routes
console.log('🛣️  Mounting routes...');
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/enhanced-reviews', enhancedReviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
console.log('✅ All routes mounted successfully');

app.get('/api/health', async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    let redisStatus = 'disconnected';
    try {
      await redisClient.ping();
      redisStatus = 'connected';
    } catch (e) {
      // Redis is disconnected
    }
    
    res.status(200).json({
      success: true,
      message: 'Server is running successfully',
      timestamp: new Date().toISOString(),
      databases: {
        mongodb: mongoStatus,
        redis: redisStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server health check failed',
      details: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// REMOVED SIGINT HANDLER FOR DEBUGGING

// Add global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit the process  
});

const server = app.listen(PORT, () => {
  console.log(`🌟 Server is running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

console.log('🎯 Server setup complete, waiting for connections...');

export default app;