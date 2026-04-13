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

const PORT = env.PORT || 4000;
const startServer = async () => {
  await DatabaseService.connect();
  const scheduler = new PlanRegenerationScheduler(
      userRepositories.subscriptionRepository,
      redisCacheService
    );
    scheduler.init();

  const httpServer = http.createServer(app);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

   initNotificationService(io, notificationRepositories.notificationRepository);

  httpServer.listen(PORT, () => {
    logger.info(` Server started on http://localhost:${PORT}`);
  });
};

startServer();