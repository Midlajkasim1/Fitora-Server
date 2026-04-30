import { ClearAllNotificationRequestDTO } from "@/application/dto/notification/request/clear-all-message.dto";
import { MarkAllReadRequestDTO } from "@/application/dto/notification/request/mark-all-as-read.dto";
import { MarkReadRequestDTO } from "@/application/dto/notification/request/mark-as-read.dto";
import { ClearAllNotificationsResponseDTO } from "@/application/dto/notification/response/clear-all-message.dto";
import { GetNotificationsResponseDTO } from "@/application/dto/notification/response/get-notifications.dto";
import { MarkAllReadResponseDTO } from "@/application/dto/notification/response/mark-all-as-read.dto";
import { MarkReadResponseDTO } from "@/application/dto/notification/response/mark-as-read.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class NotificationController {
    constructor(
        private readonly _getUserNotifications: IBaseUseCase<string, GetNotificationsResponseDTO[]>,
        private readonly _markAsReadUseCase: IBaseUseCase<MarkReadRequestDTO, MarkReadResponseDTO>,
        private readonly _markAllReadUseCase: IBaseUseCase<MarkAllReadRequestDTO, MarkAllReadResponseDTO>,
        private readonly _clearAllNotificationUseCase: IBaseUseCase<ClearAllNotificationRequestDTO, ClearAllNotificationsResponseDTO>

    ) { }

    async getMyNotifications(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const notifications = await this._getUserNotifications.execute(userId);

        return res.status(HttpStatus.OK).json(ApiResponse.success(notifications));
    };
    async markAsRead(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this._markAsReadUseCase.execute({ notificationId: id });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async markAllAsRead(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const result = await this._markAllReadUseCase.execute({ userId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async clearAllNotifcation(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const result = await this._clearAllNotificationUseCase.execute({ userId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
}
