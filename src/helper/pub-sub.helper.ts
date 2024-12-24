/* eslint-disable no-console */
import * as redis from 'redis';

export const subscribeChannel = async () => {
  const redisUrl = `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;
  const client = redis.createClient({ url: redisUrl });
  const subscriber = client.duplicate();
  await subscriber.connect();
  return subscriber;
};

