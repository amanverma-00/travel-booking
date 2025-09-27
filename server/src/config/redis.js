// src/config/redis.js
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: redisPort,
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnection attempt ${retries}`);
      if (retries > 5) {
        console.log('Redis: Max reconnection attempts reached, continuing without Redis');
        return false;
      }
      return Math.min(retries * 1000, 3000);
    },
    connectTimeout: 10000
  }
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message || err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('disconnect', () => {
  console.log('⚠️ Redis disconnected');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

export default redisClient;