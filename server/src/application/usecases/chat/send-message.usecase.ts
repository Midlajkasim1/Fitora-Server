import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { ApiResponse } from "@/shared/utils/response.handler";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ChatMessageResponseDTO } from "../../dto/chat/response/chat-message-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GRACE_PERIOD_MS } from "@/domain/constants/chat.constants";
import { SendMessageRequestDTO } from "../../dto/chat/request/send-message.dto";
import { CHAT_MESSAGES } from "@/domain/constants/messages.constants";

export class SendMessageUseCase implements IBaseUseCase<SendMessageRequestDTO, ChatMessageResponseDTO> {
  constructor(
    private readonly _chatRepo: IChatMessageRepository,
    private readonly _slotRepo: ISlotRepository,
    private readonly _socketEmitter: ISocketEmitter
  ) {}

  async execute(dto: SendMessageRequestDTO): Promise<ChatMessageResponseDTO> {
    const { senderId, receiverId, message, attachmentUrl, attachmentType } = dto;

    const isMessageEmpty = !message || message.trim().length === 0;
    const hasAttachment = !!attachmentUrl;

    if (isMessageEmpty && !hasAttachment) {
      throw new Error(CHAT_MESSAGES.MESSAGE_EMPTY);
    }

    const gracePeriodCutoff = new Date(Date.now() - GRACE_PERIOD_MS);
    
    const canMessage = await this._slotRepo.hasActiveOrRecentBooking(
      senderId, 
      receiverId, 
      gracePeriodCutoff
    );

    if (!canMessage) {
      throw new Error(CHAT_MESSAGES.COMMUNICATION_RESTRICTED);
    }

    const entity = ChatMessageEntity.create({ 
      senderId, 
      receiverId, 
      message: message || "",
      attachmentUrl,
      attachmentType
    });
    const saved = await this._chatRepo.save(entity);

    const responseDto = ChatMessageResponseDTO.fromEntity(saved);

    this._socketEmitter.emitToRoom(
      receiverId,
      "receive_message",
      ApiResponse.success(responseDto)
    );

    return responseDto;
  }
}
