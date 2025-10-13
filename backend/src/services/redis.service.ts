import Redis from 'ioredis';
import ENV from '../config/env.config';
import logger from '../logger/log';

const redis = new Redis(ENV.REDIS_URI);

redis.on('connect', () => {
  logger.info('redis connected successfully');
});
redis.on('error', (e) => {
  logger.error(e, 'redis connect EROOR!');
  process.exit(1);
});

const setToRedis = (key: string, data: string) =>
  redis.set(
    key,
    JSON.stringify({
      key,
      data,
    }),
    'EX',
    60 * 60 * 24
  );

export { redis, setToRedis };
