'use strict';

import redis from 'redis';
const redisClient = redis.createClient();

import { promisify } from 'util';
import { reservationInventory } from '../models/repositories/inventory.repo';

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setNX).bind(redisClient);

export const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_${productId}`;
  const retryTimes = 10; // Number of retries
  const expireTime = 10000; // TTL in milliseconds,

  for (let i = 0; i < retryTimes; i++) {
    const result = await setNxAsync(key, expireTime); // Try to acquire the lock

    if (result === 1) {
      // Lock acquired, set TTL for the key
      /**
       * set the pExpire key in the acquireLock function to ensure
       * that the lock has a time-to-live (TTL).
       * This is important because if the process crashes or fails
       * to release the lock, the key will automatically expire after the specified time,
       * preventing deadlocks.
       */
      await pExpire(key, expireTime);

      // Perform inventory reservation
      const reservationResult = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (reservationResult.modifiedCount) {
        return key; // Return the lock key if reservation is successful
      }

      // If reservation fails, release the lock
      await releaseLock(key);
      return null;
    } else {
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // If all retries fail, return null
  return null;
};

export const releaseLock = async (key) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  return await delAsyncKey(key);
};
