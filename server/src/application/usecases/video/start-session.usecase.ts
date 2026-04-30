import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { SlotStatus } from "@/domain/constants/session.constants";
import { logger } from "@/infrastructure/providers/loggers/logger";

import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { StartSessionRequestDTO } from "@/application/dto/video/request/start-session.dto";
import { SESSION_MESSAGES } from "@/domain/constants/messages.constants";

export class StartSessionUseCase implements IBaseUseCase<StartSessionRequestDTO, void> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _socketEmitter: ISocketEmitter
    ) {}

    async execute(dto: StartSessionRequestDTO): Promise<void> {
        const { slotId, trainerId } = dto;

        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error(SESSION_MESSAGES.SESSION_NOT_FOUND);
        }

        if (slot.trainerId.toString() !== trainerId) {
            throw new Error(SESSION_MESSAGES.ONLY_TRAINER_CAN_START);
        }

        if (slot.status === SlotStatus.COMPLETED) {
            throw new Error(SESSION_MESSAGES.SESSION_ALREADY_COMPLETED);
        }

        await this._slotRepository.updateStatus(slotId, SlotStatus.LIVE);
        logger.info(`[StartSession] Slot ${slotId} is now LIVE`);


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
