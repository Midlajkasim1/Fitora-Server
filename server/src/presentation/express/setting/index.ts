import { env } from "@/infrastructure/config/env.config";
import { DatabaseService } from "@/infrastructure/database/mongoose/connect.db";
import { notificationRepositories } from "@/infrastructure/di/common/notification.repositories";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { initNotificationService } from "@/infrastructure/providers/notification/notification.provider";
import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./app";
import { PlanRegenerationScheduler } from "@/infrastructure/providers/scheduler/plan.regeneration.scheduler";
import { userRepositories } from "@/infrastructure/di/user/user.repositories";
import { redisCacheService } from "@/infrastructure/di/user/user.usecases";
import { initSocketEmitter } from "@/infrastructure/providers/socket/socket-emitter";
import { SocketChatService } from "@/infrastructure/providers/socket/socket-chat.service";
import { SocketVideoService } from "@/infrastructure/providers/socket/socket-video.service";
import { chatUseCases } from "@/infrastructure/di/chat/chat.di";
import { socketAuthMiddleware } from "@/infrastructure/providers/socket/socket-auth.middleware";

const PORT = env.PORT || 4000;

const startServer = async () => {
  await DatabaseService.connect();

  const scheduler = new PlanRegenerationScheduler(
    userRepositories.subscriptionRepository,
    redisCacheService
  );
  scheduler.init();


  initSocketEmitter();

  const httpServer = http.createServer(app);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // ── Step 2: Global Notification & Identity Room Joining
  // Ensures every connected socket joins a room named after their userId
  io.use(socketAuthMiddleware);
  io.on("connection", (socket) => {
     const { userId } = socket.data.user;
     if (userId) {
         socket.join(userId);
         logger.info(`[Socket] User ${userId} joined identity room on root namespace`);
     }
  });

  initNotificationService(io, notificationRepositories.notificationRepository);


  new SocketChatService(
    io,
    chatUseCases.sendMessageUseCase,
    chatUseCases.getChatHistoryUseCase
  );

  new SocketVideoService(io);

  httpServer.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
  });
};

startServer();