import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis when the module is imported
await redisClient.connect();

// Cache middleware for Express routes
export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      // Try to get cached data
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        // If data is found in cache, return it
        return res.json(JSON.parse(cachedData));
      }
      
      // If no cached data, modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the data with the specified duration
        redisClient.setEx(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Redis cache error:', error);
      next();
    }
  };
};

// Utility functions for Redis operations
export const setCache = async (key, value, duration) => {
  try {
    await redisClient.setEx(key, duration, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting cache:', error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting cache:', error);
    return false;
  }
};

export const clearCache = async () => {
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

export default redisClient; 