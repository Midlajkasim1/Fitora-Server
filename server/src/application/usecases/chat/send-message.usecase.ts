import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { ApiResponse } from "@/shared/utils/response.handler";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ChatMessageResponseDTO } from "../../dto/chat/response/chat-message-response.dto";

export interface SendMessageInput {
  senderId: string;
  receiverId: string;
  message: string;
}

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours

export class SendMessageUseCase {
  constructor(
    private readonly _chatRepo: IChatMessageRepository,
    private readonly _slotRepo: ISlotRepository,
    private readonly _socketEmitter: ISocketEmitter
  ) {}

  async execute(input: SendMessageInput): Promise<ChatMessageEntity> {
    const { senderId, receiverId, message } = input;

    if (!message || message.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    // ─── Grace Period & Authorization Check ──────────────────────────────────
    const gracePeriodCutoff = new Date(Date.now() - GRACE_PERIOD_MS);
    
    const canMessage = await this._slotRepo.hasActiveOrRecentBooking(
      senderId, 
      receiverId, 
      gracePeriodCutoff
    );

    if (!canMessage) {
      throw new Error(
        "You can only message users you have an active or recent booking with (24-hour grace period)."
      );
    }

    // ─── Persist ─────────────────────────────────────────────────────────────
    const entity = ChatMessageEntity.create({ senderId, receiverId, message });
    const saved = await this._chatRepo.save(entity);

    // ─── Emit to Receiver ─────────────────────────────────────────────────────
    this._socketEmitter.emitToRoom(
      receiverId,
      "receive_message",
      ApiResponse.success(ChatMessageResponseDTO.fromEntity(saved))
    );

    return saved;
  }
}
