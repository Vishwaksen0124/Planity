import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
let redisClient = null;
let redisConnected = false;

if (process.env.NODE_ENV !== 'test') {
  try {
    // Create Redis client
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error('Redis: Max reconnection attempts reached');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    console.log('Redis URL:', process.env.REDIS_URL || 'redis://localhost:6379');

    // Connect to Redis
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      redisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      redisConnected = true;
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
      redisConnected = true;
    });

    redisClient.on('end', () => {
      console.log('Redis connection closed');
      redisConnected = false;
    });

    // Connect to Redis when the module is imported
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to initialize Redis:', error.message);
    console.log('Application will continue without Redis caching');
    redisClient = null;
  }
} else {
  console.log('Redis client not initialized in test environment');
}

// Cache middleware for Express routes
export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip if Redis is not available
    if (!redisClient || !redisConnected) {
      return next();
    }

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
      res.json = function (data) {
        // Cache the data with the specified duration
        if (redisClient && redisConnected) {
          redisClient.setEx(key, duration, JSON.stringify(data)).catch(err => {
            console.error('Failed to cache data:', err.message);
          });
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Redis cache error:', error.message);
      next();
    }
  };
};

// Utility functions for Redis operations
export const setCache = async (key, value, ttl = 3600) => {
  if (!redisClient || !redisConnected) {
    return;
  }
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting cache:', error.message);
  }
};

export const getCache = async (key) => {
  if (!redisClient || !redisConnected) {
    return null;
  }
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis cache error:', error.message);
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redisClient || !redisConnected) {
    return;
  }
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error.message);
  }
};

export const clearCache = async () => {
  if (!redisClient || !redisConnected) {
    return false;
  }
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error.message);
    return false;
  }
};

export default redisClient; 