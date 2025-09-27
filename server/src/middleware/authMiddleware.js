import jwt from "jsonwebtoken";
import User from "../models/user.js";
import redisClient from "../config/redis.js";

export const userMiddleware = async (req, res, next) => {
  try {
    let token = null;
    
    console.log('Auth middleware called for:', req.method, req.path);
    console.log('Headers:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    
    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // If not in cookies, check for Authorization header
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      // Check if it's a Bearer token
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // If it's just the token
        token = authHeader;
      }
    }
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = payload;
    console.log('JWT payload decoded, user ID:', _id);

    if (!_id) {
      console.log('No user ID in token payload');
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    // Check if token is blocked in Redis (with error handling)
    try {
      const isBlocked = await redisClient.exists(`token:${token}`);
      if (isBlocked) {
        console.log('Token is blocked in Redis');
        return res.status(401).json({
          error: "Token has been invalidated"
        });
      }
      console.log('Token not blocked in Redis');
    } catch (redisError) {
      console.log('Redis error during token check (continuing anyway):', redisError.message);
      // Continue without blocking if Redis is down - we'll rely on JWT expiration
    }

    const user = await User.findById(_id);
    if (!user) {
      console.log('User not found with ID:', _id);
      return res.status(401).json({
        error: "User doesn't exist"
      });
    }

    console.log('User found:', user.emailId);
    req.user = user;
    console.log('Authentication successful, calling next()');
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: "Token expired"
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: "Invalid token"
      });
    }
    
    res.status(500).json({
      error: "Server error: " + err.message
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    let token = null;
    
    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // If not in cookies, check for Authorization header
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      // Check if it's a Bearer token
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // If it's just the token
        token = authHeader;
      }
    }
    
    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id, role } = payload;

    if (!_id) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    if (role !== 'admin') {
      return res.status(403).json({
        error: "Access denied. Admin privileges required."
      });
    }

    // Check if token is blocked in Redis
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({
        error: "Token has been invalidated"
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({
        error: "User doesn't exist"
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: "Token expired"
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: "Invalid token"
      });
    }
    
    res.status(500).json({
      error: "Server error: " + err.message
    });
  }
};

// Alias for userMiddleware to match common naming conventions
export const protect = userMiddleware;

// Host authorization middleware
export const hostRequired = async (req, res, next) => {
  try {
    // First ensure user is authenticated (should be called after protect)
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    // Check if user is a host or admin
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: "Host privileges required"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: "Server error: " + error.message
    });
  }
};