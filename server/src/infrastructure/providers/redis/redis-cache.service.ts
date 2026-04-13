
import { ICacheService } from "@/domain/interfaces/services/cache-service";
import { redisClient } from "./redis.client";

export class RedisCacheService implements ICacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const result = await redisClient.set(lockKey, "locked", "EX", ttlSeconds, "NX");
    return result === "OK";
  }

  async releaseLock(key: string): Promise<void> {
    await redisClient.del(`lock:${key}`);
  }
}