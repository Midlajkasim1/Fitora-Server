import { Request, Response } from "express";
import { WebhookReceiver } from "livekit-server-sdk";
import { HandleParticipantJoinedUseCase } from "@/application/usecases/video/handle-participant-joined.usecase";
import { HandleParticipantLeftUseCase } from "@/application/usecases/video/handle-participant-left.usecase";
import { ApiResponse } from "@/shared/utils/response.handler";
import { HttpStatus } from "@/domain/constants/http-status.constants";

export class LiveKitWebhookController {
    private receiver: WebhookReceiver;

    constructor(
        private readonly _handleParticipantJoinedUseCase: HandleParticipantJoinedUseCase,
        private readonly _handleParticipantLeftUseCase: HandleParticipantLeftUseCase
    ) {
        this.receiver = new WebhookReceiver(
            process.env.LIVEKIT_API_KEY || "",
            process.env.LIVEKIT_API_SECRET || ""
        );
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const event = await this.receiver.receive(
                req.body,
                req.get("Authorization") || ""
            );

            console.log("LiveKit Webhook Event:", event.event);

            const slotId = event.room?.name;
            const userId = event.participant?.identity;

            if (slotId && userId) {
                if (event.event === "participant_joined") {
                    await this._handleParticipantJoinedUseCase.execute({ slotId, userId });
                } else if (event.event === "participant_left") {
                    await this._handleParticipantLeftUseCase.execute({ slotId, userId });
                }
            }

            res.status(HttpStatus.OK).json(ApiResponse.success({ status: "processed" }));
        } catch (error: unknown) {
            console.error("LiveKit Webhook Error:", error);
            res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error("Invalid webhook signature or data"));
        }
    }
}
