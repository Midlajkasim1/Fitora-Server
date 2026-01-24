import Redis from "ioredis";
import { logger } from "../loggers/logger";
import { env } from "@/infrastructure/config/env.config";

export const redisClient = new Redis(
  env.REDIS_URL || "redis://127.0.0.1:6379"
);

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("error", (err) => {
  logger.error("Redis error", err);
});
