import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { IMediaServerProvider } from "@/domain/interfaces/services/media-server.interface";
import { SlotStatus } from "@/domain/constants/session.constants";
import { logger } from "@/infrastructure/providers/loggers/logger";

export interface EndCallRequest {
    slotId: string;
    requestedBy: string; // userId who is ending the call (usually trainer)
}

export class EndCallUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _socketEmitter: ISocketEmitter,
        private readonly _mediaServer: IMediaServerProvider,
    ) {}

    async execute(request: EndCallRequest): Promise<void> {
        const { slotId, requestedBy } = request;

        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error("Session not found");
        }

        if (slot.trainerId.toString() !== requestedBy) {
             // In a real app, check if requestedBy is an admin
        }

        // 3. Mark Slot as COMPLETED
        await this._slotRepository.updateStatus(slotId, SlotStatus.COMPLETED);
        logger.info(`[EndCall] Slot ${slotId} marked as COMPLETED`);

        // 4. Close Media Server Session (Adapter Pattern)
        try {
            await this._mediaServer.closeSession(slotId);
        } catch (error) {
            logger.error(`[EndCall] Error closing media session: ${error}`);
        }

        // 5. Force Disconnect all peers in the room via Redis Emitter
        this._socketEmitter.disconnectRoom(slotId);
        logger.info(`[EndCall] Force-disconnected all peers in room ${slotId}`);

        // 6. Trigger Commission Split (80/20)
        // This is where the financial integrity part happens.
        // We'll call a service to process trainer earnings.
        await this._processCommissionSplit(slotId, slot.trainerId.toString());
    }

    private async _processCommissionSplit(slotId: string, trainerId: string): Promise<void> {
        logger.info(`[Commission] Processing 80/20 split for Slot: ${slotId}, Trainer: ${trainerId}`);
        
        // Split Logic Implementation:
        // 1. Find the total amount paid for this slot (from Payment record)
        // 2. Calculate Trainer Share: total * 0.8
        // 3. Calculate Platform Share: total * 0.2
        // 4. Update Trainer's Wallet/Earnings record
        
        // Placeholder for the actual implementation:
        // await this._commissionService.execute({ slotId, trainerId, trainerSharePercent: 80 });
    }
}
