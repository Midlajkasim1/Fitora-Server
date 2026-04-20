import { Namespace, Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { socketAuthMiddleware } from "./socket-auth.middleware";
import { SendMessageUseCase } from "@/application/usecases/chat/send-message.usecase";
import { GetChatHistoryUseCase } from "@/application/usecases/chat/get-chat-history.usecase";
import { ApiResponse } from "@/shared/utils/response.handler";
import { env } from "@/infrastructure/config/env.config";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { SendMessageRequestDTO } from "@/application/dto/chat/request/send-message.dto";
import { GetChatHistoryRequestDTO } from "@/application/dto/chat/request/get-chat-history.dto";
import { ChatMessageResponseDTO } from "@/application/dto/chat/response/chat-message-response.dto";
import { ChatHistoryResponseDTO } from "@/application/dto/chat/response/chat-history-response.dto";

export class SocketChatService {
  private readonly _io: Server;
  private readonly _chatNamespace: Namespace;

  constructor(
    io: Server,
    private readonly _sendMessageUseCase: SendMessageUseCase,
    private readonly _getChatHistoryUseCase: GetChatHistoryUseCase
  ) {
    this._io = io;
    this._attachRedisAdapter();
    this._chatNamespace = this._io.of("/chat");
    this._init();
  }

  private _init(): void {
    this._chatNamespace.use(socketAuthMiddleware);
    this._chatNamespace.on("connection", (socket) => this._onConnection(socket));
    logger.info("[SocketChatService] Namespace /chat initialized");
  }

  private _attachRedisAdapter(): void {
    const pubClient = new Redis(env.REDIS_URL);
    const subClient = pubClient.duplicate();
    this._io.adapter(createAdapter(pubClient, subClient));
    logger.info("[SocketChatService] Redis Adapter attached to main Server");
  }

  private _onConnection(socket: Socket): void {
    const { userId } = socket.data.user as JwtPayload;
    socket.join(userId);
    logger.info(`[Chat] User ${userId} connected (${socket.id})`);

    socket.on("send_message", (data) => this._handleSendMessage(socket, data));
    socket.on("get_chat_history", (data) => this._handleGetChatHistory(socket, data));
    socket.on("disconnect", () => logger.info(`[Chat] User ${userId} disconnected`));
  }

  // ── Handlers (SRP) ────────────────────────────────────────────────────────

  private async _handleSendMessage(socket: Socket, payload: any): Promise<void> {
    try {
      const { userId } = socket.data.user as JwtPayload;
      const dto = new SendMessageRequestDTO(payload);

      if (!dto.receiverId || !dto.message) {
        return this._emitError(socket, "receiverId and message are required");
      }

      const saved = await this._sendMessageUseCase.execute({
        senderId: userId,
        receiverId: dto.receiverId,
        message: dto.message,
      });

      socket.emit(
        "message_sent",
        ApiResponse.success(ChatMessageResponseDTO.fromEntity(saved), "Delivered")
      );
    } catch (error) {
      this._processError(socket, "send_message", error);
    }
  }

  private async _handleGetChatHistory(socket: Socket, payload: any): Promise<void> {
    try {
      const { userId } = socket.data.user as JwtPayload;
      const dto = new GetChatHistoryRequestDTO(payload);

      if (!dto.otherUserId) {
        return this._emitError(socket, "otherUserId is required");
      }

      const result = await this._getChatHistoryUseCase.execute({
        requesterId: userId,
        otherUserId: dto.otherUserId,
        page: dto.page,
        limit: dto.limit,
      });

      socket.emit(
        "chat_history",
        ApiResponse.success(ChatHistoryResponseDTO.fromResult(result))
      );
    } catch (error) {
      this._processError(socket, "get_chat_history", error);
    }
  }

  private _emitError(socket: Socket, message: string): void {
    socket.emit("chat_error", ApiResponse.error(message));
  }

  private _processError(socket: Socket, context: string, error: unknown): void {
    const message = error instanceof Error ? error.message : "Internal error";
    logger.error(`[Chat] ${context} error:`, error);
    this._emitError(socket, message);
  }
}
