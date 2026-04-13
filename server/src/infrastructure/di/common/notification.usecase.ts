import { GetUserNotificationsUseCase } from "@/application/usecases/notification/get-user-notification.usecase";
import { notificationRepositories } from "./notification.repositories";
import { MarkNotificationReadUseCase } from "@/application/usecases/notification/mark-notification.usecase";
import { MarkAllNotificationReadUseCase } from "@/application/usecases/notification/mark-all-read.usecase";
import { ClearAllNotificationUseCase } from "@/application/usecases/notification/clear-all-notifiction.usecase";

export const notificationUseCases = {
  getUserNotifications: new GetUserNotificationsUseCase(
    notificationRepositories.notificationRepository
  ),
  markNotificationRead: new MarkNotificationReadUseCase(
    notificationRepositories.notificationRepository
  ),
  markAllAsReadUseCase:new MarkAllNotificationReadUseCase(
    notificationRepositories.notificationRepository
  ),
  clearAllNotificationUseCase:new ClearAllNotificationUseCase(
    notificationRepositories.notificationRepository
  )
};