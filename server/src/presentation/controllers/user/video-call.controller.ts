import { GenerateCallTokenUseCase } from "@/application/usecases/video/generate-call-token.usecase";
import { EndSessionUseCase } from "@/application/usecases/video/end-session.usecase";
import { StartSessionUseCase } from "@/application/usecases/video/start-session.usecase";
import { GetSessionAccessStateUseCase } from "@/application/usecases/video/get-session-access-state.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class VideoCallController {
    constructor(
        private readonly _generateCallTokenUseCase: GenerateCallTokenUseCase,
        private readonly _endSessionUseCase: EndSessionUseCase,
        private readonly _startSessionUseCase: StartSessionUseCase,
        private readonly _getSessionAccessStateUseCase: GetSessionAccessStateUseCase
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
            await this._endSessionUseCase.execute({ slotId, trainerId: userId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(null, "Session ended and commission split processed"));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to end session";
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
        }
    }

    /**
     * GET /sessions/:slotId/access
     * Returns the current session access state for the user.
     */
    async getAccessState(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { slotId } = req.params;

        try {
            const result = await this._getSessionAccessStateUseCase.execute({ slotId, userId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to get session access state";
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
