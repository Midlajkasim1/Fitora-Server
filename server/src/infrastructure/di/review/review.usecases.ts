import { CreateReviewUseCase } from "@/application/usecases/review/create-review.usecase";
import { SubmitSessionReportUseCase } from "@/application/usecases/review/submit-session-report.usecase";
import { GetTrainerReviewsUseCase } from "@/application/usecases/review/get-trainer-reviews.usecase";
import { reviewRepositories } from "./review.repositories";
import { userRepositories } from "../user/user.repositories";

export const reviewUseCases = {
  createReviewUseCase: new CreateReviewUseCase(
    reviewRepositories.reviewRepository,
    userRepositories.bookingRepository,
    userRepositories.slotRepository,
    userRepositories.trainerRepository
  ),
  submitSessionReportUseCase: new SubmitSessionReportUseCase(
    reviewRepositories.sessionReportRepository
  ),
  getTrainerReviewsUseCase: new GetTrainerReviewsUseCase(
    reviewRepositories.reviewRepository
  ),
};
