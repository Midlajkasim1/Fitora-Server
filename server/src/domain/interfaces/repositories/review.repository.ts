import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { IBaseRepository } from "./base.repository";

export interface IReviewRepository extends IBaseRepository<ReviewEntity> {
  findByTrainerId(trainerId: string): Promise<ReviewEntity[]>;
  calculateAverageRating(trainerId: string): Promise<number>;
  findByBookingId(bookingId: string): Promise<ReviewEntity | null>;
}
