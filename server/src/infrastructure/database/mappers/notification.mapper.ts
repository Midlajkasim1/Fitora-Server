import { NotificationEntity } from "@/domain/entities/notification/notification.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { Types } from "mongoose";
import { INotificationDocument } from "../interfaces/notification.document.interface";

export class NotificationMapper implements IMapper<NotificationEntity, INotificationDocument> {

  toEntity(doc: INotificationDocument): NotificationEntity {
    return NotificationEntity.create({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      message: doc.message,
      type: doc.type,
      isRead: doc.isRead,
      createdAt: doc.createdAt
    });
  }

  toMongo(entity: NotificationEntity): Partial<INotificationDocument> {
    return {
      userId: new Types.ObjectId(entity.userId),
      title: entity.title,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead
    };
  }
}