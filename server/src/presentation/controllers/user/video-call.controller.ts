import { GenerateCallTokenUseCase } from "@/application/usecases/video/generate-call-token.usecase";
import { EndCallUseCase } from "@/application/usecases/video/end-call.usecase";
import { StartSessionUseCase } from "@/application/usecases/video/start-session.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class VideoCallController {
    constructor(
        private readonly _generateCallTokenUseCase: GenerateCallTokenUseCase,
        private readonly _endCallUseCase: EndCallUseCase,
        private readonly _startSessionUseCase: StartSessionUseCase
    ) {}

    /**
     * GET /sessions/:slotId/join-token
     * Verifies booking and returns a WebRTC join token.
     */
    async getJoinToken(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        try {
            const result = await this._generateCallTokenUseCase.execute({ slotId, userId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(result, "Join token generated successfully"));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate join token";
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
        }
    }

    /**
     * POST /sessions/:slotId/end
     * Marks the session as completed and disconnects all participants.
     */
    async endSession(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        try {
            await this._endCallUseCase.execute({ slotId, requestedBy: userId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(null, "Session ended and commission split processed"));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to end session";
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
        }
    }

    /**
     * POST /sessions/:slotId/start
     * Marks the session as active and notifies participants.
     */
    async startSession(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        try {
            await this._startSessionUseCase.execute({ slotId, trainerId: userId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(null, "Session started and participants notified"));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to start session";
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
        }
    }
}
