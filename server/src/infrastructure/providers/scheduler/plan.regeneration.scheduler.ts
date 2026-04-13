import { CronJob } from "cron";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ICacheService } from "@/domain/interfaces/services/cache-service";

export class PlanRegenerationScheduler {
  constructor(
    private readonly _subRepo: ISubscriptionRepository,
    private readonly _cacheService: ICacheService
  ) {}

  public init(): void {
   
    const autoRegenerateJob = new CronJob("0 0 * * 1", async () => {
      logger.info(" CRON START: Weekly AI Plan Reset");
      
      try {
        const activeUsers = await this._subRepo.findEveryActive();

        if (activeUsers.length === 0) {
          logger.info("No active subscribers found for plan reset.");
          return;
        }

        for (const user of activeUsers) {
          try {
         
            await this._cacheService.delete(`workout:${user.userId}`);
            await this._cacheService.delete(`diet_plan:${user.userId}`);
            
            logger.info(`Invalidated plans for user: ${user.userId}`);
          } catch (err) {
            logger.error(`Error invalidating cache for ${user.userId}:`, err);
          }
        }
        
        logger.info(`CRON SUCCESS: ${activeUsers.length} users processed`);
      } catch (error) {
        logger.error("CRON FATAL ERROR:", error);
      }
    });

    autoRegenerateJob.start();
    logger.info("Weekly Plan Regeneration Scheduler initialized.");
  }
} 