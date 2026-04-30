import { Request, Response } from "express";
import { EndSessionUseCase } from "@/application/usecases/video/end-session.usecase";
import { GetSessionAccessStateUseCase } from "@/application/usecases/video/get-session-access-state.usecase";
import { ApiResponse } from "@/shared/utils/response.handler";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, VIDEO_MESSAGES } from "@/domain/constants/messages.constants";

export class VideoController {
    constructor(
        private readonly _endSessionUseCase: EndSessionUseCase,
        private readonly _getSessionAccessStateUseCase: GetSessionAccessStateUseCase
    ) {}

    async endSession(req: Request, res: Response): Promise<void> {
        const { slotId } = req.params;
        const trainerId = req.user?.userId;

        if (!trainerId) {
            res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
            return;
        }

        await this._endSessionUseCase.execute({ slotId, trainerId });
        res.status(HttpStatus.OK).json(ApiResponse.success(null, VIDEO_MESSAGES.SESSION_ENDED));
    }

    async getSessionAccessState(req: Request, res: Response): Promise<void> {
        const { slotId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
            return;
        }

        const result = await this._getSessionAccessStateUseCase.execute({ slotId, userId });
        res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
}
