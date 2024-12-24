/* eslint-disable no-console */
import ValueType from 'ioredis';
import { redisInstance } from '../lib/redis';


class RedisService {
  // private _redisClient: Redis = redisInstance.client;

  // default expiration = 1 week = 604800 seconds
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  async set(key: string, data: object, expiration: number = 604800): Promise<boolean> {
    // console.log('RedisService@set');
    const value = JSON.stringify(data);
    const result = await redisInstance.client.set(key, value);

    if (result !== 'OK') {
      return false;
    }

    if (expiration !== 0) {
      try {
        await redisInstance.client.expire(key, expiration);
      } catch (err) {
        // console.log('error setting expiration: ', err);
        return false;
      }
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  async getAllKeys(pattern: string = '*'): Promise<string[]> {
    // console.log('RedisService@getAllKeys');
    return await redisInstance.client.keys(pattern);
  }

  async getByKey<T>(key: string): Promise<T | null> {
    // console.log('RedisService@getByKey');
    const result = await redisInstance.client.get(key);

    // eslint-disable-next-line prettier/prettier
    if (typeof result !== 'string') {
      return result;
    }

    try {
      const data = JSON.parse(result);

      return data;
    } catch (err) {
      // console.log('error parsing data: ', err);
      return null;
    }
  }

  async deleteKey(key: string): Promise<boolean> {
    // console.log('RedisService@deleteKey');
    try {
      const result = await redisInstance.client.del(key);

      return result > 0;
    } catch (err) {
      // console.log('error deleting key: ', err);
      return false;
    }
  }

  // default expiration 15 minutes
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  async hSet(key: string, data: { [key: string]: string | number }, expiration: number = 0): Promise<boolean> {
    // console.log('RedisService@hSet');

    let parsedData: { [key: string]: string | number };

    try {
      parsedData = JSON.parse(JSON.stringify(data));
    } catch (err) {
      // console.log('error parsing data to json: ', err);
      return false;
    }

    let fields = Object.keys(parsedData);

    if (fields.length < 1) {
      return false;
    }

    let values: ValueType[] = [];
    for (let x = 0; x < fields.length; x += 1) {
      try {
        await redisInstance.client.hset(key, fields[x], parsedData[fields[x]]);
      } catch (err) {
        // console.log('error with hset: ', err);
        return false;
      }
    }

    if (values.length < 1) {
      return false;
    }

    if (expiration > 0) {
      try {
        await redisInstance.client.expire(key, expiration);
      } catch (err) {
        // console.log('error setting expiration: ', err);
        return false;
      }
    }

    return true;
  }

  async hGet<T>(key: string, field: keyof T): Promise<string | number | null> {
    // console.log('RedisService@hGet');

    if (typeof field !== 'string') {
      return null;
    }

    const result = await redisInstance.client.hget(key, field as string);

    if (!result) {
      return null;
    }

    if (Number.isNaN(parseInt(result, 10))) {
      return result;
    }
    return parseInt(result, 10);
  }

  async hGetAll<T>(key: string): Promise<T | false> {
    // console.log('RedisService@hGetAll');

    const result = await redisInstance.client.hgetall(key);

    if (Object.keys(result).length < 1) {
      return false;
    }

    try {
      const data = JSON.parse(JSON.stringify(result));

      return data;
    } catch (err) {
      // console.log('error parsing json: ', err);
      return false;
    }
  }

  async hupdateField<T>(key: string, field: keyof T, value: string): Promise<boolean> {
    // console.log('RedisService@hupdateField');
    // eslint-disable-next-line prettier/prettier
    if (typeof field !== 'string') {
      return false;
    }

    try {
      const result = await redisInstance.client.hset(key, `${field} ${value}`);

      return result > 0;
    } catch (err) {
      // console.log('error updating field: ', err);
      return false;
    }
  }

  async hdeleteField<T>(key: string, field: keyof T): Promise<boolean> {
    // console.log('RedisService@hdeleteField');

    // eslint-disable-next-line prettier/prettier
    if (typeof key !== 'string') {
      return false;
    }

    try {
      await redisInstance.client.hdel(key, field as string);

      return true;
    } catch (err) {
      // console.log('error deleting hash set field', err);
      return false;
    }
  }

  async hdeleteOne(key: string): Promise<boolean> {
    // console.log('RedisService@hdeleteOne');
    try {
      const result = await redisInstance.client.hdel(key);

      return result > 0;
    } catch (err) {
      // console.log('error deleting key: ', err);
      return false;
    }
  }

  async flushCache(): Promise<boolean> {
    // console.log('RedisService@flushCache');
    try {
      await redisInstance.client.flushall();

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * The function `lPushKey` pushes a value to the left end of a Redis list identified by a given key.
   * @param {string} key - The `key` parameter is a string that represents the key of the list in Redis
   * where the data will be pushed.
   * @param data - The `data` parameter is the data that you want to push to the Redis list. It can be
   * of any type, as long as it can be serialized to JSON using `JSON.stringify()`.
   * @returns a Promise that resolves to a boolean value.
   */
  async lPushKey(key: string, data: any): Promise<boolean> {
    // console.log('RedisService@lPushKey');
    try {
      let value = JSON.stringify(data);
      // let value = `,${JSON.stringify(data)}`
      const result = await redisInstance.client.lpush(key, value);
      return result > 0;
    } catch (err) {
      // console.log('error updating key: ', err);
      return false;
    }
  }

  /**
   * The function `lRange` retrieves a range of elements from a Redis list and returns them as an array.
   * @param {string} key - The `key` parameter is a string that represents the key of the list in Redis
   * that you want to retrieve the range from.
   * @returns a Promise that resolves to either the data retrieved from Redis or null if there was an
   * error parsing the data.
   */
  async lRange<T>(key: string): Promise<T | null> {
    // console.log('RedisService@getByKey');
    const result: any = await redisInstance.client.lrange(key, 0, -1);
    try {
      const data: any = result;
      return data;
    } catch (err) {
      // console.log('error parsing data: ', err);
      return null;
    }
  }

  /**
   * The function `lRemoveKey` removes a specified value from a Redis list by key.
   * @param {string} key - The key is a string that represents the name of the list in Redis from which
   * you want to remove the data.
   * @param data - The `data` parameter is the value that you want to remove from the list stored under
   * the given `key`.
   * @returns a Promise that resolves to a boolean value.
   */
  async lRemoveKey(key: string, data): Promise<boolean> {
    // console.log('RedisService@lRemoveKey');
    try {
      const result = await redisInstance.client.lrem(key, -1, data);
      return result > 0;
    } catch (err) {
      // console.log('error updating key: ', err);
      return false;
    }
  }

  async TTL(key: string): Promise<boolean> {
    // console.log('RedisService@flushCache');
    try {
      const result = await redisInstance.client.ttl(key);
      return !(result < 0);
    } catch (err) {
      return false;
    }
  }
}

export default new RedisService();
