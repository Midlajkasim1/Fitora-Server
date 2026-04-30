import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IMediaServerProvider } from "@/domain/interfaces/services/media-server.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { env } from "@/infrastructure/config/env.config";
import { SlotStatus } from "@/domain/constants/session.constants";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GenerateCallTokenRequestDTO } from "@/application/dto/video/request/generate-call-token.dto";
import { GenerateCallTokenResponseDTO } from "@/application/dto/video/response/generate-call-token.dto";
import { SESSION_MESSAGES, AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class GenerateCallTokenUseCase implements IBaseUseCase<GenerateCallTokenRequestDTO, GenerateCallTokenResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _mediaServer: IMediaServerProvider
    ) {}

    async execute(dto: GenerateCallTokenRequestDTO): Promise<GenerateCallTokenResponseDTO> {
        const { slotId, userId } = dto;

        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error(SESSION_MESSAGES.SESSION_NOT_FOUND);
        }
        const isTrainer = slot.trainerId.toString() === userId;
        const isParticipant = slot.participants.some(p => p.toString() === userId);

        if (!isTrainer && !isParticipant) {
            throw new Error(SESSION_MESSAGES.UNAUTHORIZED_SESSION);
        }

        if (!isTrainer) {
            const isSessionLive = slot.status === SlotStatus.LIVE;
            
            if (!isSessionLive) {
                const now = new Date();
                const startTime = new Date(slot.startTime);
                const bufferMillis = 5 * 60 * 1000; // 5 minutes

                if (now.getTime() < startTime.getTime() - bufferMillis) {
                    throw new Error(SESSION_MESSAGES.SESSION_NOT_STARTED);
                }
            }


            const now = new Date();
            const endTime = new Date(slot.endTime);
            if (now.getTime() > endTime.getTime()) {
                throw new Error(SESSION_MESSAGES.SESSION_ALREADY_ENDED);
            }
        }

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        const participantName = `${user.firstName} ${user.lastName}`;

        const token = await this._mediaServer.generateToken({
            roomId: slotId,
            participantId: userId,
            participantName,
            isTrainer
        });

        return { 
            token, 
            host: env.LIVEKIT_URL,
            trainerId: slot.trainerId.toString()
        };
    }
}
