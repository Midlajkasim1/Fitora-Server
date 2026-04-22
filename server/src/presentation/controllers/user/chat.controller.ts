import { GetChatHistoryInput, GetChatHistoryOutput } from "@/application/usecases/chat/get-chat-history.usecase";
import { MarkMessagesReadDTO } from "@/application/usecases/chat/mark-read.usecase";
import { SendMessageInput } from "@/application/usecases/chat/send-message.usecase";
import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class ChatController {
  constructor(
    private readonly _getChatHistoryUseCase: IBaseUseCase<GetChatHistoryInput, GetChatHistoryOutput>,
    private readonly _sendMessageUseCase: IBaseUseCase<SendMessageInput, ChatMessageEntity>,
    private readonly _markMessagesReadUseCase: IBaseUseCase<MarkMessagesReadDTO, void>
  ) {}

  async getChatHistory(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
    }

    const { otherUserId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await this._getChatHistoryUseCase.execute({
      requesterId: userId,
      otherUserId,
      page,
      limit,
    });

    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }

  async sendMessage(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
    }

    const { receiverId, message } = req.body;

    const result = await this._sendMessageUseCase.execute({
      senderId: userId,
      receiverId,
      message,
    });

    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
  async markAsRead(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
    }

    const { otherUserId } = req.params;

    await this._markMessagesReadUseCase.execute({
      senderId: otherUserId, // Marking messages FROM otherUserId as read
      receiverId: userId, // TO the current user
    });

    return res.status(HttpStatus.OK).json(ApiResponse.success({ success: true }));
  }
}
