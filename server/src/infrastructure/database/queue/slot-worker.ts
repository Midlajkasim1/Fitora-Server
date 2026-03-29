import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { slotExpiryQueue } from "@/infrastructure/providers/bullQueue/slot-queue.service";

export const initSlotWorker = (slotRepo: ISlotRepository) => { 
  slotExpiryQueue.process(async (job) => {
    const { slotId } = job.data;
    
    await slotRepo.completeSession(slotId);
  });
};