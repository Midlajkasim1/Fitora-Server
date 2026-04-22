import { ReviewController } from "@/presentation/controllers/user/review.controller";
import { reviewUseCases } from "./review.usecases";

export const reviewControllers = {
  reviewController: new ReviewController(
    reviewUseCases.createReviewUseCase,
    reviewUseCases.submitSessionReportUseCase,
    reviewUseCases.getTrainerReviewsUseCase
  ),
};
