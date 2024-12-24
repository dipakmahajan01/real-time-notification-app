// eslint-disable-next-line @typescript-eslint/no-inferrable-types
import Redis, { Redis as RedisClient } from 'ioredis';

const redisUrl = `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;

class RedisInstance {
  private _redisClient?: RedisClient;

  get client(): RedisClient {
    if (!this._redisClient) {
      throw new Error('Redis client has not yet been initialized');
    }

    return this._redisClient;
  }

  connect(): Promise<RedisClient> {
    this._redisClient = new Redis(redisUrl);

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        resolve(this._redisClient);
      });

      this.client.on('error', () => {
        reject(new Error('Could not connect to Redis'));
      });
    });
  }
}
export const redisInstance = new RedisInstance();