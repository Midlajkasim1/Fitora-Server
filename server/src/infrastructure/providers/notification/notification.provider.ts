import { Server } from "socket.io";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";
import { SocketNotificationService } from "./socket-service";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";
import { logger } from "../loggers/logger";

// 1. This holds the "real" service once the server starts
let notificationServiceInstance: SocketNotificationService | null = null;

/**
 * Called in index.ts inside startServer()
 */
export const initNotificationService = (io: Server, repo: INotificationRepository): void => {
  notificationServiceInstance = new SocketNotificationService(io, repo);
};

/**
 * Internal helper to get the real instance
 */
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