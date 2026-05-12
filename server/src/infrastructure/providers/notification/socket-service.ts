import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";
import { NotificationEntity } from "@/domain/entities/notification/notification.entity";
import { Server, Socket } from "socket.io";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";
import { logger } from "../loggers/logger";
import { NotificationType } from "@/domain/constants/notification.constants";


export class SocketNotificationService implements INotificationService {
    private _io: Server;

    constructor(io: Server, private readonly _notificationRepo: INotificationRepository) {
        this._io = io;
        this.setupListeners();
    }

    private setupListeners(): void {
        this._io.on("connection", (socket: Socket) => {
            // Get userId from authenticated socket data (set by socketAuthMiddleware)
            // Fallback to query for backward compatibility or special cases
            const userId = (socket.data?.user?.userId as string) || (socket.handshake.query.userId as string);

            if (userId) {
                socket.join(userId);
                logger.info(`[Notification] User ${userId} joined room (${socket.id})`);
            }

            socket.on("disconnect", () => {
                if (userId) {
                    logger.info(`[Notification] User ${userId} disconnected`);
                }
            });
        });
    }

    async notify(userId: string, data: { title: string; message: string; type: NotificationType }): Promise<void> {
        try {
            if (!this._io) {
                logger.error("Cannot send notification: Socket IO not initialized");
                return;
            }
            const notification = NotificationEntity.create({
                userId,
                title: data.title,
                message: data.message,
                type: data.type,
            });

            await this._notificationRepo.create(notification);

            this._io.to(userId).emit("notification_received", {
                title: data.title,
                message: data.message,
                type: data.type,
                createdAt: new Date(),
                isRead: false
            });

            logger.info(`Real-time notification sent to user: ${userId}`);
        } catch (error) {
            logger.error("Failed to process notification:", error);
        }
    }

    async broadcast(data: { title: string; message: string; type: NotificationType }): Promise<void> {
        this._io.emit("notification_received", {
            ...data,
            createdAt: new Date(),
            isRead: false
        });
        logger.info(`Broadcast notification sent to all online users: ${data.title}`);
    }
}