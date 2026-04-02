import { NotificationEntity } from "../../entities/notification/notification.entity";
import { IBaseRepository } from "./base.repository";

export interface INotificationRepository extends IBaseRepository<NotificationEntity> {
 
  findByUserId(userId: string, limit: number): Promise<NotificationEntity[]>;

  markAsRead(notificationId: string): Promise<void>;


  markAllAsRead(userId: string): Promise<void>;

  clearAll(userId: string): Promise<void>;
}