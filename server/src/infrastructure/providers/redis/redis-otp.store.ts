import { IOtpStore } from "@/domain/interfaces/services/otp-store.interface";
import { redisClient } from "./redis.client";
export class RedisOtpStore implements IOtpStore {

  async save(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redisClient.set(
      key,
      JSON.stringify(value),
      "EX",
      ttlSeconds
    );
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }
  
}
