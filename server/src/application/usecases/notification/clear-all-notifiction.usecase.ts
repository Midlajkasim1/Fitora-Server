import { ClearAllNotificationRequestDTO } from "@/application/dto/notification/request/clear-all-message.dto";
import { ClearAllNotificationsResponseDTO } from "@/application/dto/notification/response/clear-all-message.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { NOTIFICATION_MESSAGES } from "@/domain/constants/messages.constants";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";


export class ClearAllNotificationUseCase implements IBaseUseCase<ClearAllNotificationRequestDTO,ClearAllNotificationsResponseDTO>{
    constructor(
        private readonly _notifictionRepo:INotificationRepository
    ){}
   async execute(dto: ClearAllNotificationRequestDTO): Promise<ClearAllNotificationsResponseDTO> {
        await this._notifictionRepo.clearAll(dto.userId);
        return {
            success:true,
            message:NOTIFICATION_MESSAGES.CLEAR_ALL_NOTIFICATION
        }; 
    }
}