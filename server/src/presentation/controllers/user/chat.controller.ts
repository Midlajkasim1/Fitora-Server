import { GetChatHistoryRequestDTO } from "@/application/dto/chat/request/get-chat-history.dto";
import { GetChatHistoryResponseDTO } from "@/application/dto/chat/response/get-chat-history.dto";
import { MarkMessagesReadRequestDTO } from "@/application/dto/chat/request/mark-messages-read.dto";
import { SendMessageRequestDTO } from "@/application/dto/chat/request/send-message.dto";
import { ChatMessageResponseDTO } from "@/application/dto/chat/response/chat-message-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { Request, Response } from "express";

export class ChatController {
  constructor(
    private readonly _getChatHistoryUseCase: IBaseUseCase<GetChatHistoryRequestDTO, GetChatHistoryResponseDTO>,
    private readonly _sendMessageUseCase: IBaseUseCase<SendMessageRequestDTO, ChatMessageResponseDTO>,
    private readonly _markMessagesReadUseCase: IBaseUseCase<MarkMessagesReadRequestDTO, void>,
    private readonly _uploadChatAttachmentUseCase: IBaseUseCase<Record<string, unknown>, { attachmentUrl: string; attachmentType: string }, UploadFileDTO>
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

  async uploadAttachment(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
    }

    if (!req.file) {
      throw new Error(AUTH_MESSAGES.FILE_NOT_FOUND);
    }

    const result = await this._uploadChatAttachmentUseCase.execute({}, req.file);

    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
}
