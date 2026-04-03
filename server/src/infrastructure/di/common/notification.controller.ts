import { NotificationController } from "@/presentation/controllers/user/notification.controller";
import { notificationUseCases } from "./notification.usecase";

export const notificationControllers = {
  notificationController: new NotificationController(
    notificationUseCases.getUserNotifications,
    notificationUseCases.markNotificationRead
  )
};