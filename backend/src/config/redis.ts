import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  return redisClient;
}

export async function connectRedis(): Promise<void> {
  if (!env.REDIS_ENABLED || !env.REDIS_URL) {
    logger.info('Redis is disabled — skipping connection');
    return;
  }

  try {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
    });

    redisClient.on('error', (err) => {
      logger.error({ err }, 'Redis connection error');
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected');
    });

    await redisClient.connect();
  } catch (err) {
    logger.error({ err }, 'Failed to connect to Redis');
    throw err;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
}
