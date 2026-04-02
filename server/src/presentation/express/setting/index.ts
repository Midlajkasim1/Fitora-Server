import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./app";
import { env } from "@/infrastructure/config/env.config";
import { DatabaseService } from "@/infrastructure/database/mongoose/connect.db";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { notificationRepositories } from "@/infrastructure/di/user/notification.repositories";
import { initNotificationService } from "@/infrastructure/providers/notification/notification.provider";

const PORT = env.PORT || 4000;
const startServer = async () => {
  await DatabaseService.connect();

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