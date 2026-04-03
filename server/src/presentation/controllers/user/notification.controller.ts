import { MarkReadRequestDTO } from "@/application/dto/notification/request/mark-as-read.dto";
import { GetNotificationsResponseDTO } from "@/application/dto/notification/response/get-notifications.dto";
import { MarkReadResponseDTO } from "@/application/dto/notification/response/mark-as-read.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { Request, Response } from "express";

export class NotificationController {
    constructor(
        private readonly _getUserNotifications: IBaseUseCase<string, GetNotificationsResponseDTO[]>,
        private readonly _markAsReadUseCase:  IBaseUseCase<MarkReadRequestDTO, MarkReadResponseDTO>

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
    async markAsRead(req:Request,res:Response):Promise<Response>{
        const {id} = req.params;
        const result = await this._markAsReadUseCase.execute({notificationId:id});
        return res.status(HttpStatus.OK).json(result);
    }
}