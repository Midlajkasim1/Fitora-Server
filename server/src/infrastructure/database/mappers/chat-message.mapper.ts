import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IChatMessageDocument } from "../interfaces/chat-message.document";
import { Types } from "mongoose";

export class ChatMessageMapper implements IMapper<ChatMessageEntity, IChatMessageDocument> {
  toEntity(doc: IChatMessageDocument): ChatMessageEntity {
    return new ChatMessageEntity(
      {
        senderId: doc.senderId.toString(),
        receiverId: doc.receiverId.toString(),
        message: doc.message,
        attachmentUrl: doc.attachmentUrl,
        attachmentType: doc.attachmentType,
        isRead: doc.isRead,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toString()
    );
  }

  toMongo(entity: ChatMessageEntity): Partial<IChatMessageDocument> {
    const doc: Partial<IChatMessageDocument> = {
      senderId: new Types.ObjectId(entity.senderId),
      receiverId: new Types.ObjectId(entity.receiverId),
      message: entity.message,
      attachmentUrl: entity.attachmentUrl,
      attachmentType: entity.attachmentType,
      isRead: entity.isRead,
    };
    return doc;
  }
}
