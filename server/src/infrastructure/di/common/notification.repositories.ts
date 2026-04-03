import { NotificationMapper } from "@/infrastructure/database/mappers/notification.mapper";
import { NotificationRepository } from "@/infrastructure/database/repositories/notification.repository";

const notificationMapper = new NotificationMapper();

export const notificationRepositories = {
  notificationRepository: new NotificationRepository(notificationMapper),
};