import { Server } from "socket.io";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";
import { SocketNotificationService } from "./socket-service";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";
import { logger } from "../loggers/logger";

let notificationServiceInstance: SocketNotificationService | null = null;


export const initNotificationService = (io: Server, repo: INotificationRepository): void => {
  notificationServiceInstance = new SocketNotificationService(io, repo);
};


const getNotificationService = (): SocketNotificationService | null => {
  return notificationServiceInstance;
};


export const notificationServiceProxy: INotificationService = {
  notify: async (userId, data) => {
    const service = getNotificationService();
    if (service) {
      await service.notify(userId, data);
    } else {
      logger.warn("Notification skipped: Service not initialized yet.");
    }
  },
  broadcast: async (data) => {
    const service = getNotificationService();
    if (service) {
      await service.broadcast(data);
    } else {
      logger.warn("Broadcast skipped: Service not initialized yet.");
    }
  }
};