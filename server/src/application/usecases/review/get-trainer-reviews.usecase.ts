import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { IReviewRepository } from "@/domain/interfaces/repositories/review.repository";

export class GetTrainerReviewsUseCase implements IBaseUseCase<string, ReviewEntity[]> {
  constructor(private readonly _reviewRepository: IReviewRepository) {}

  async execute(trainerId: string): Promise<ReviewEntity[]> {
    return await this._reviewRepository.findByTrainerId(trainerId);
  }
}
