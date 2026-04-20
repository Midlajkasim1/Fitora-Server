import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IChatMessageDocument } from "../interfaces/chat-message.document";
import { Types } from "mongoose";

export class ChatMessageMapper implements IMapper<ChatMessageEntity, IChatMessageDocument> {
  toEntity(doc: IChatMessageDocument): ChatMessageEntity {
    return new ChatMessageEntity({
      id: doc._id.toString(),
      senderId: doc.senderId.toString(),
      receiverId: doc.receiverId.toString(),
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toMongo(entity: ChatMessageEntity): Partial<IChatMessageDocument> {
    return {
      senderId: new Types.ObjectId(entity.senderId),
      receiverId: new Types.ObjectId(entity.receiverId),
      message: entity.message,
      isRead: entity.isRead,
    };
  }
}
