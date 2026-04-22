import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IMediaServerProvider } from "@/domain/interfaces/services/media-server.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { env } from "@/infrastructure/config/env.config";


import { SlotStatus } from "@/domain/constants/session.constants";

export interface GenerateCallTokenRequest {
    slotId: string;
    userId: string;
}

export class GenerateCallTokenUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _mediaServer: IMediaServerProvider
    ) {}

    async execute(request: GenerateCallTokenRequest): Promise<{ token: string; host: string; trainerId: string }> {
        const { slotId, userId } = request;

        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error("Session not found");
        }
        const isTrainer = slot.trainerId.toString() === userId;
        const isParticipant = slot.participants.some(p => p.toString() === userId);

        if (!isTrainer && !isParticipant) {
            throw new Error("You are not authorized for this session");
        }

        if (!isTrainer) {
            // If the trainer has already marked it as LIVE, let the client in regardless of time.
            const isSessionLive = slot.status === SlotStatus.LIVE;
            
            if (!isSessionLive) {
                const now = new Date();
                const startTime = new Date(slot.startTime);
                const bufferMillis = 5 * 60 * 1000; // 5 minutes

                if (now.getTime() < startTime.getTime() - bufferMillis) {
                    throw new Error("Session has not started yet. You can join 5 minutes early.");
                }
            }


            const now = new Date();
            const endTime = new Date(slot.endTime);
            if (now.getTime() > endTime.getTime()) {
                throw new Error("This session has already ended.");
            }
        }

        // 4. Fetch User Info for Media Server
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const participantName = `${user.firstName} ${user.lastName}`;

        // 5. Generate Token via Adapter
        const token = await this._mediaServer.generateToken(
            slotId,
            userId,
            participantName,
            isTrainer
        );

        return { 
            token, 
            host: env.LIVEKIT_URL,
            trainerId: slot.trainerId.toString()
        };
    }
}
