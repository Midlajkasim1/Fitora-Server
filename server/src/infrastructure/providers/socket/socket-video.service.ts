import { Namespace, Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./socket-auth.middleware";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";

export class SocketVideoService {
  private readonly _videoNamespace: Namespace;

  constructor(io: Server) {
    this._videoNamespace = io.of("/video");
    this._init();
  }

  private _init(): void {
    this._videoNamespace.use(socketAuthMiddleware);
    this._videoNamespace.on("connection", (socket) => this._onConnection(socket));
    logger.info("[SocketVideoService] Namespace /video initialized");
  }

  private _onConnection(socket: Socket): void {
    const { userId, role } = socket.data.user as JwtPayload;
    logger.info(`[Video] User ${userId} (${role}) connected (${socket.id})`);

    socket.on("join-room", (data: { slotId: string }) => {
      const { slotId } = data;
      socket.join(slotId);
      logger.info(`[Video] User ${userId} joined room ${slotId}`);
      
      // Notify others in the room
      socket.to(slotId).emit("user-joined", { userId, role });
    });

    socket.on("offer", (data: { slotId: string; offer: any; to: string }) => {
      socket.to(data.slotId).emit("offer", {
        from: userId,
        offer: data.offer,
      });
    });

    socket.on("answer", (data: { slotId: string; answer: any; to: string }) => {
      socket.to(data.slotId).emit("answer", {
        from: userId,
        answer: data.answer,
      });
    });

    socket.on("ice-candidate", (data: { slotId: string; candidate: any; to: string }) => {
      socket.to(data.slotId).emit("ice-candidate", {
        from: userId,
        candidate: data.candidate,
      });
    });

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((slotId) => {
        if (slotId !== socket.id) {
          if (role === "trainer") {
            socket.to(slotId).emit("trainer-disconnected", {
              message: "Trainer dropped. Attempting to reconnect...",
            });
            logger.warn(`[Video] Trainer ${userId} disconnected from room ${slotId}`);
          }
          socket.to(slotId).emit("user-left", { userId, role });
        }
      });
    });

    socket.on("disconnect", () => {
      logger.info(`[Video] User ${userId} disconnected`);
    });
  }

  /**
   * Closes a room and notifies all participants.
   * Can be called by a scheduler when the slot expires.
   */
  public closeRoom(slotId: string): void {
    this._videoNamespace.to(slotId).emit("session-ended", {
      message: "This session has reached its scheduled end time.",
    });
    logger.info(`[Video] Room ${slotId} closed due to timeout`);
    // Note: Use ISocketEmitter to force disconnect if needed
  }
}
