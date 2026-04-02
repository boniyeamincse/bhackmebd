const Redis = require('ioredis');
const { createPool } = require('generic-pool');
const logger = require('../utils/logger');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const baseOptions = {
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy: (times) => Math.min(times * 100, 2000),
};

const redis = new Redis(REDIS_URL, baseOptions);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error', { message: err.message }));

const redisPool = createPool(
  {
    create: async () => {
      const client = new Redis(REDIS_URL, { ...baseOptions, lazyConnect: true });
      await client.connect();
      return client;
    },
    destroy: async (client) => {
      await client.quit();
    },
  },
  {
    min: 1,
    max: 10,
    acquireTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  }
);

const withRedis = async (fn) => {
  const client = await redisPool.acquire();
  try {
    return await fn(client);
  } finally {
    redisPool.release(client);
  }
};

module.exports = redis;
module.exports.redisPool = redisPool;
module.exports.withRedis = withRedis;
