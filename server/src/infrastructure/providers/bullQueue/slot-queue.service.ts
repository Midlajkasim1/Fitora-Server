import Queue from "bull";
import { env } from "@/infrastructure/config/env.config";
import { logger } from "../loggers/logger";

export const slotExpiryQueue = new Queue("slot-expiry", env.REDIS_URL || "redis://127.0.0.1:6379");

slotExpiryQueue.on("completed", (job) => {
  logger.info(`Job ${job.id} completed: Slot ${job.data.slotId} marked as finished.`);
});

slotExpiryQueue.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});