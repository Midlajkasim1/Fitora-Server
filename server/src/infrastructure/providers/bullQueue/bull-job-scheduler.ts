import { IJobScheduler } from "@/domain/interfaces/services/job-scheduler.interface";
import { slotExpiryQueue } from "./slot-queue.service";

export class BullJobScheduler implements IJobScheduler {
  async scheduleSessionExpiry(slotId: string, delay: number): Promise<void> {
    await slotExpiryQueue.add(
      { slotId: slotId },
      { 
        delay: delay, 
        attempts: 3 
      }
    );
  }
  async cancelScheduledExpiry(slotId: string): Promise<void> {
    const jobId = `expiry-${slotId}`; 
    const job = await slotExpiryQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

}