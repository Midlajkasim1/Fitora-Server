import { MongooseReviewRepository } from "@/infrastructure/database/repositories/review.repository";
import { MongooseSessionReportRepository } from "@/infrastructure/database/repositories/session-report.repository";

export const reviewRepositories = {
  reviewRepository: new MongooseReviewRepository(),
  sessionReportRepository: new MongooseSessionReportRepository(),
};
