import { GenerateCallTokenUseCase } from "@/application/usecases/video/generate-call-token.usecase";
import { EndSessionUseCase } from "@/application/usecases/video/end-session.usecase";
import { StartSessionUseCase } from "@/application/usecases/video/start-session.usecase";
import { GetSessionAccessStateUseCase } from "@/application/usecases/video/get-session-access-state.usecase";
import { HandleParticipantJoinedUseCase } from "@/application/usecases/video/handle-participant-joined.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, VIDEO_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { logger } from "@/infrastructure/providers/loggers/logger";

export class VideoCallController {
    constructor(
        private readonly _generateCallTokenUseCase: GenerateCallTokenUseCase,
        private readonly _endSessionUseCase: EndSessionUseCase,
        private readonly _startSessionUseCase: StartSessionUseCase,
        private readonly _getSessionAccessStateUseCase: GetSessionAccessStateUseCase,
        private readonly _handleParticipantJoinedUseCase: HandleParticipantJoinedUseCase
    ) {}


  
    async getJoinToken(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        const result = await this._generateCallTokenUseCase.execute({ slotId, userId });
        
        try {
            await this._handleParticipantJoinedUseCase.execute({ slotId, userId });
        } catch (err) {
            logger.warn("[VideoCallController] Non-critical error recording join:", err);
        }

        return res.status(HttpStatus.OK).json(ApiResponse.success(result, VIDEO_MESSAGES.TOKEN_GENERATED));
    }

  
    async endSession(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        await this._endSessionUseCase.execute({ slotId, trainerId: userId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, VIDEO_MESSAGES.SESSION_ENDED_WITH_COMMISSION));
    }


    async getAccessState(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        const result = await this._getSessionAccessStateUseCase.execute({ slotId, userId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }


 
    async startSession(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        await this._startSessionUseCase.execute({ slotId, trainerId: userId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, VIDEO_MESSAGES.SESSION_STARTED_AND_NOTIFIED));
    }
}
