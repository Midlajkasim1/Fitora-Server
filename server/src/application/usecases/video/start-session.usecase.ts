import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { SlotStatus } from "@/domain/constants/session.constants";
import { logger } from "@/infrastructure/providers/loggers/logger";

export interface StartSessionRequest {
    slotId: string;
    trainerId: string;
}

export class StartSessionUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _socketEmitter: ISocketEmitter
    ) {}

    async execute(request: StartSessionRequest): Promise<void> {
        const { slotId, trainerId } = request;

        // 1. Fetch Slot and verify trainer
        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error("Session not found");
        }

        if (slot.trainerId.toString() !== trainerId) {
            throw new Error("Only the assigned trainer can start this session");
        }

        if (slot.status === SlotStatus.COMPLETED) {
            throw new Error("This session has already been completed");
        }

        // 2. Update status to ACTIVE
        await this._slotRepository.updateStatus(slotId, SlotStatus.ACTIVE);
        logger.info(`[StartSession] Slot ${slotId} is now ACTIVE`);

        // 3. Notify all participants
        // We emit to each participant's individual room (userId) so they see the notification
        // and can click "Join Session".
        const participants = slot.participants.map(p => p.toString());
        
        participants.forEach(userId => {
            this._socketEmitter.emitToRoom(userId, "session-started", {
                slotId,
                trainerId,
                message: "Your trainer has started the session! Click to join.",
            });
        });

        logger.info(`[StartSession] Notified ${participants.length} participants for slot ${slotId}`);
    }
}
