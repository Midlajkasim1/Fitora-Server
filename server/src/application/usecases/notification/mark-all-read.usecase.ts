import { MarkAllReadRequestDTO } from "@/application/dto/notification/request/mark-all-as-read.dto";
import { MarkAllReadResponseDTO } from "@/application/dto/notification/response/mark-all-as-read.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { NOTIFICATION_MESSAGES } from "@/domain/constants/messages.constants";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";



export class MarkAllNotificationReadUseCase implements IBaseUseCase<MarkAllReadRequestDTO,MarkAllReadResponseDTO>{
    constructor(
        private readonly _notificationRepo:INotificationRepository
    ){}
    async execute(dto: MarkAllReadRequestDTO): Promise<MarkAllReadResponseDTO> {
        await this._notificationRepo.markAllAsRead(dto.userId);
        return {
            success:true,
            message:NOTIFICATION_MESSAGES.MARK_ALL_READ
        };
    }
}