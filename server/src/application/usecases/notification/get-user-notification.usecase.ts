import { GetNotificationsResponseDTO } from "@/application/dto/notification/response/get-notifications.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";

export class GetUserNotificationsUseCase implements IBaseUseCase<string, GetNotificationsResponseDTO[]> {
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<GetNotificationsResponseDTO[]> {
    const notifications = await this._notificationRepo.findByUserId(userId, 50);

    return notifications.map(entity => ({
      id: entity.id!,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead,
      createdAt: entity.createdAt
    }));
  }
}