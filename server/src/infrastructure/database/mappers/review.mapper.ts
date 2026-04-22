import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IReviewDocument } from "../interfaces/review-document.interface";
import { Types } from "mongoose";

export class ReviewMapper implements IMapper<ReviewEntity, IReviewDocument> {
  toEntity(doc: IReviewDocument): ReviewEntity {
    return new ReviewEntity({
      id: doc._id.toString(),
      bookingId: doc.booking_id.toString(),
      userId: doc.user_id.toString(),
      trainerId: doc.trainer_id.toString(),
      rating: doc.rating,
      comment: doc.comment,
      createdAt: doc.created_at
    });
  }

  toMongo(entity: ReviewEntity): Partial<IReviewDocument> {
    return {
      booking_id: new Types.ObjectId(entity.bookingId),
      user_id: new Types.ObjectId(entity.userId),
      trainer_id: new Types.ObjectId(entity.trainerId),
      rating: entity.rating,
      comment: entity.comment
    };
  }
}
