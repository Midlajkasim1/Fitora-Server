export interface ITrainerPayoutService {
    processSlotPayout(slotId: string): Promise<void>;
}
