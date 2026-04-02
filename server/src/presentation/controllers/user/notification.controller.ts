import { GetNotificationsResponseDTO } from "@/application/dto/user/response/get-notifications.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { Request, Response } from "express";

export class NotificationController {
    constructor(
        private readonly _getUserNotifications: IBaseUseCase<string, GetNotificationsResponseDTO[]>

    ) { }

    async getMyNotifications(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const notifications = await this._getUserNotifications.execute(userId);

        return res.status(200).json({
            success: true,
            data: notifications
        });
    };
}