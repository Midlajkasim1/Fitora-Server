import { Request, Response } from "express";
import { WebhookReceiver } from "livekit-server-sdk";
import { HandleParticipantJoinedUseCase } from "@/application/usecases/video/handle-participant-joined.usecase";
import { HandleParticipantLeftUseCase } from "@/application/usecases/video/handle-participant-left.usecase";
import { ExecuteSessionPayoutUseCase } from "@/application/usecases/video/execute-session-payout.usecase";
import { ApiResponse } from "@/shared/utils/response.handler";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { logger } from "@/infrastructure/providers/loggers/logger";

export class LiveKitWebhookController {
    private receiver: WebhookReceiver;

    constructor(
        private readonly _handleParticipantJoinedUseCase: HandleParticipantJoinedUseCase,
        private readonly _handleParticipantLeftUseCase: HandleParticipantLeftUseCase,
        private readonly _executeSessionPayoutUseCase: ExecuteSessionPayoutUseCase
    ) {
        this.receiver = new WebhookReceiver(
            process.env.LIVEKIT_API_KEY || "",
            process.env.LIVEKIT_API_SECRET || ""
        );
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        const event = await this.receiver.receive(
            req.body,
            req.get("Authorization") || ""
        );

        logger.info(`LiveKit Webhook Event: ${event.event}`);

        const slotId = event.room?.name;
        const userId = event.participant?.identity;

        logger.info(`[LiveKit Webhook] Event: ${event.event}, Room: ${slotId}, User: ${userId}`);

        if (slotId && userId) {
            if (event.event === "participant_joined") {
                await this._handleParticipantJoinedUseCase.execute({ slotId, userId });
            } else if (event.event === "participant_left") {
                await this._handleParticipantLeftUseCase.execute({ slotId, userId });
            }
        } else if (slotId && event.event === "room_finished") {
            await this._executeSessionPayoutUseCase.execute({ slotId });
        }

        res.status(HttpStatus.OK).json(ApiResponse.success({ status: "processed" }));
    }
}
