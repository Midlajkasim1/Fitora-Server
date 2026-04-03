import { MarkReadRequestDTO } from "@/application/dto/notification/request/mark-as-read.dto";
import { MarkReadResponseDTO } from "@/application/dto/notification/response/mark-as-read.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";

export class MarkNotificationReadUseCase implements IBaseUseCase<MarkReadRequestDTO, MarkReadResponseDTO> {
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(dto: MarkReadRequestDTO): Promise<MarkReadResponseDTO> {
    await this._notificationRepo.markAsRead(dto.notificationId);
    
    return {
      success: true,
      message: "Notification marked as read successfully"
    };
  }
}