import { GetUserNotificationsUseCase } from "@/application/usecases/notification/get-user-notification.usecase";
import { notificationRepositories } from "./notification.repositories";
import { MarkNotificationReadUseCase } from "@/application/usecases/notification/mark-notification.usecase";

export const notificationUseCases = {
  getUserNotifications: new GetUserNotificationsUseCase(
    notificationRepositories.notificationRepository
  ),
  markNotificationRead: new MarkNotificationReadUseCase(
    notificationRepositories.notificationRepository
  )
};