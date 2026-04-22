import { IReviewRepository } from "@/domain/interfaces/repositories/review.repository";
import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { ReviewModel } from "../models/review.model";
import { ReviewMapper } from "../mappers/review.mapper";
import { BaseRepository } from "./base.repository";
import mongoose, { Model } from "mongoose";
import { IReviewDocument } from "../interfaces/review-document.interface";

export class MongooseReviewRepository
  extends BaseRepository<ReviewEntity, IReviewDocument>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel as unknown as Model<IReviewDocument>, new ReviewMapper());
  }

  async findByTrainerId(trainerId: string): Promise<ReviewEntity[]> {
    const docs = await this.model.find({ trainer_id: new mongoose.Types.ObjectId(trainerId) }).sort({ created_at: -1 }).lean<IReviewDocument[]>();
    return docs.map((doc) => this.mapper.toEntity(doc));
  }

  async calculateAverageRating(trainerId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { trainer_id: new mongoose.Types.ObjectId(trainerId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    if (result.length === 0) return 0;
    return (result[0] as { averageRating: number }).averageRating;
  }

  async findByBookingId(bookingId: string): Promise<ReviewEntity | null> {
    const doc = await this.model.findOne({ booking_id: new mongoose.Types.ObjectId(bookingId) }).lean<IReviewDocument>();
    return doc ? this.mapper.toEntity(doc) : null;
  }
}
