export interface IJobScheduler {
  scheduleSessionExpiry(slotId: string, delayInMilliseconds: number): Promise<void>;
  cancelScheduledExpiry(slotId: string): Promise<void>
}